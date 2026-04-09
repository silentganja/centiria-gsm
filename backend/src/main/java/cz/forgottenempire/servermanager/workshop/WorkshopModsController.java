package cz.forgottenempire.servermanager.workshop;

import cz.forgottenempire.servermanager.common.ServerType;
import cz.forgottenempire.servermanager.common.exceptions.NotFoundException;
import cz.forgottenempire.servermanager.workshop.metadata.ModMetadata;
import cz.forgottenempire.servermanager.workshop.metadata.ModMetadataService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/mod")
class WorkshopModsController {

    private final WorkshopModsFacade modsFacade;
    private final ModMetadataService metadataService;
    private final ModMapper modMapper = Mappers.getMapper(ModMapper.class);

    @Autowired
    public WorkshopModsController(WorkshopModsFacade modsFacade, ModMetadataService metadataService) {
        this.modsFacade = modsFacade;
        this.metadataService = metadataService;
    }

    @GetMapping
    @Cacheable("workshopModsResponse")
    public ResponseEntity<ModsDto> getAllMods(@RequestParam(required = false) ServerType filter) {
        log.debug("Getting all mods");
        List<CreatorDlcDto> creatorDlcDtos = Collections.emptyList();
        if (filter == null || filter == ServerType.ARMA3) {
            creatorDlcDtos = modMapper.creatorDlcsToCreatorDlcDtos(Arma3CDLC.getAll());
        }
        List<ModDto> workshopModDtos = modMapper.modsToModDtos(modsFacade.getAllMods(filter));
        ModsDto modsDto = new ModsDto(workshopModDtos, creatorDlcDtos);
        return ResponseEntity.ok(modsDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModDto> getMod(@PathVariable Long id) {
        WorkshopMod mod = findMod(id);
        return ResponseEntity.ok(modMapper.modToModDto(mod));
    }

    /**
     * Fetch mod details from Bohemia Workshop by hex GUID (no database registration).
     * Used for the live mod browser preview.
     */
    @GetMapping("/bohemia/{hexId}")
    public ResponseEntity<Map<String, Object>> getBohemiaModDetails(@PathVariable String hexId) {
        log.info("Fetching Bohemia Workshop details for mod: {}", hexId);
        ModMetadata metadata = metadataService.fetchBohemiaModMetadata(hexId);
        return ResponseEntity.ok(Map.of(
                "modId", hexId,
                "name", metadata.name(),
                "author", metadata.author() != null ? metadata.author() : "Unknown",
                "description", metadata.description() != null ? metadata.description() : "",
                "thumbnailUrl", metadata.thumbnailUrl() != null ? metadata.thumbnailUrl() : "",
                "consumerAppId", metadata.consumerAppId()
        ));
    }

    /**
     * Register a Reforger mod by its Bohemia hex GUID.
     * The mod metadata is scraped from reforger.armaplatform.com.
     * The actual mod files are downloaded natively by the server on startup.
     */
    @PostMapping("/reforger")
    public ResponseEntity<ModDto> registerReforgerMod(@RequestParam String modId, @RequestParam(required = false) String name) {
        log.info("Registering Reforger mod: {}", modId);
        WorkshopMod mod = modsFacade.registerReforgerMod(modId, name);
        return ResponseEntity.ok(modMapper.modToModDto(mod));
    }

    @PostMapping
    public ResponseEntity<ModsDto> installOrUpdateMods(@RequestParam List<Long> modIds) {
        log.info("Installing or updating mods: {}", modIds);
        List<WorkshopMod> workshopMods = modsFacade.saveAndInstallMods(modIds);
        return ResponseEntity.ok(new ModsDto(modMapper.modsToModDtos(workshopMods), Collections.emptyList()));
    }

    @PostMapping("/{id}")
    public ResponseEntity<ModDto> installOrUpdateMod(@PathVariable Long id) {
        log.info("Installing mod id {}", id);
        WorkshopMod mod = modsFacade.saveAndInstallMods(List.of(id)).get(0);
        return ResponseEntity.ok(modMapper.modToModDto(mod));
    }

    @DeleteMapping
    public ResponseEntity<?> uninstallMods(@RequestParam List<Long> modIds) {
        log.info("Uninstalling mods: {}", modIds);
        modIds.forEach(id -> modsFacade.uninstallMod(id));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> uninstallMod(@PathVariable Long id) {
        log.info("Uninstalling mod {}", id);
        modsFacade.uninstallMod(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> setModServerOnly(@PathVariable Long id, @RequestBody ServerOnlyDto serverOnlyDto) {
        WorkshopMod mod = findMod(id);
        modsFacade.setModServerOnly(mod, serverOnlyDto.serverOnly());
        return ResponseEntity.ok().build();
    }

    private WorkshopMod findMod(Long id) {
        return modsFacade.getMod(id)
                .orElseThrow(() -> new NotFoundException("Mod ID " + id + " does not exist or is not installed"));
    }
}
