package cz.forgottenempire.servermanager.workshop.metadata;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

public record ModMetadata(
        @Nonnull String name,
        @Nonnull String consumerAppId,
        @Nullable String author,
        @Nullable String description,
        @Nullable String size,
        @Nullable String thumbnailUrl,
        @Nullable String rating
) {
    // Convenience constructor for backward compat
    public ModMetadata(@Nonnull String name, @Nonnull String consumerAppId) {
        this(name, consumerAppId, null, null, null, null, null);
    }
}
