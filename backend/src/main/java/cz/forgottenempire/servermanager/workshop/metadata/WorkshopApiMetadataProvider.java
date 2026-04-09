package cz.forgottenempire.servermanager.workshop.metadata;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.forgottenempire.servermanager.common.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
class WorkshopApiMetadataProvider {

    private static final String STEAM_REQUEST_URL = Constants.STEAM_API_URL + "?key=%s&itemcount=1&publishedfileids[0]=%d";
    private static final String BOHEMIA_WORKSHOP_URL = "https://reforger.armaplatform.com/workshop/";

    private final String steamApiKey;
    private final RestTemplate restTemplate;

    @Autowired
    WorkshopApiMetadataProvider(@Value("${steam.api.key:}") String steamApiKey, RestTemplate restTemplate) {
        this.steamApiKey = steamApiKey;
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch mod metadata from the Bohemia Workshop by scraping the HTML page.
     * Used for Arma Reforger mods which use hex GUID IDs.
     */
    Optional<ModMetadata> fetchBohemiaModMetadata(String hexModId) {
        try {
            String url = BOHEMIA_WORKSHOP_URL + hexModId;
            log.info("Fetching Bohemia Workshop metadata from: {}", url);
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            String html = response.getBody();
            if (html == null || html.isEmpty()) {
                log.warn("Empty response from Bohemia Workshop for mod {}", hexModId);
                return Optional.empty();
            }
            return parseBohemiaHtml(html, hexModId);
        } catch (RestClientException e) {
            log.error("Request to Bohemia Workshop for mod '{}' failed: {}", hexModId, e.getMessage());
            return Optional.empty();
        }
    }

    private Optional<ModMetadata> parseBohemiaHtml(String html, String hexModId) {
        // Extract title from <title> tag: "ModName - Arma Reforger Workshop"
        String name = extractBetween(html, "<title>", " - Arma Reforger Workshop</title>");
        if (name == null || name.isEmpty()) {
            name = extractBetween(html, "<title>", "</title>");
        }
        if (name == null || name.isEmpty()) {
            name = hexModId;
        }

        // Extract OG description
        String description = extractMetaContent(html, "og:description");

        // Extract OG image for thumbnail
        String thumbnailUrl = extractMetaContent(html, "og:image");

        // Try to extract author from the page structure
        String author = null;
        // Bohemia workshop pages typically have "by AuthorName" pattern
        Pattern byPattern = Pattern.compile("\\bby ([A-Za-z0-9_ ]+)");
        Matcher byMatcher = byPattern.matcher(html);
        if (byMatcher.find()) {
            author = byMatcher.group(1).trim();
        }

        // For Reforger mods, consumerAppId is always 1874900
        return Optional.of(new ModMetadata(
                name.trim(),
                "1874900",
                author,
                description,
                null, // size not reliably parseable from HTML
                thumbnailUrl,
                null  // rating not reliably parseable
        ));
    }

    private String extractBetween(String html, String start, String end) {
        int startIdx = html.indexOf(start);
        if (startIdx == -1) return null;
        startIdx += start.length();
        int endIdx = html.indexOf(end, startIdx);
        if (endIdx == -1) return null;
        return html.substring(startIdx, endIdx);
    }

    private String extractMetaContent(String html, String property) {
        // Match: <meta property="og:description" content="..."/>
        Pattern pattern = Pattern.compile(
                "<meta\\s+(?:property|name)=\"" + Pattern.quote(property) + "\"\\s+content=\"([^\"]*?)\"",
                Pattern.CASE_INSENSITIVE
        );
        Matcher matcher = pattern.matcher(html);
        if (matcher.find()) {
            return matcher.group(1);
        }
        // Try reversed attribute order
        Pattern pattern2 = Pattern.compile(
                "<meta\\s+content=\"([^\"]*?)\"\\s+(?:property|name)=\"" + Pattern.quote(property) + "\"",
                Pattern.CASE_INSENSITIVE
        );
        Matcher matcher2 = pattern2.matcher(html);
        if (matcher2.find()) {
            return matcher2.group(1);
        }
        return null;
    }

    /**
     * Fetch mod metadata from the Steam Workshop API.
     * Used for Arma 3 and DayZ mods which use numeric Steam Workshop IDs.
     */
    Optional<ModMetadata> fetchModMetadata(long modId) {
        JsonPropertyProvider propertyProvider = createPropertyProvider(modId);
        if (propertyProvider == null) {
            return Optional.empty();
        }

        String modName = propertyProvider.findName();
        String consumerAppId = propertyProvider.findConsumerAppId();
        if (modName == null || consumerAppId == null) {
            return Optional.empty();
        }

        return Optional.of(new ModMetadata(modName, consumerAppId));
    }

    private JsonPropertyProvider createPropertyProvider(long modId) {
        JsonNode modInfoJson = getModInfoFromSteamApi(modId);
        if (modInfoJson == null) {
            return null;
        }
        return new JsonPropertyProvider(modInfoJson);
    }

    private JsonNode getModInfoFromSteamApi(long modId) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(prepareRequest(modId), String.class);
            JsonNode parsedResponse = new ObjectMapper().readTree(response.getBody()).findValue("response");
            return parsedResponse.findValue("publishedfiledetails").get(0);
        } catch (RestClientException e) {
            log.error("Request to Steam Workshop API for mod ID '{}' failed", modId, e);
            return null;
        } catch (JsonProcessingException e) {
            log.error("Failed to process Workshop API response for mod ID {}", modId, e);
            return null;
        }
    }

    private String prepareRequest(long modId) {
        return STEAM_REQUEST_URL.formatted(steamApiKey, modId);
    }
}
