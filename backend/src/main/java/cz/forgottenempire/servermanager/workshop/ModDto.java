package cz.forgottenempire.servermanager.workshop;

import cz.forgottenempire.servermanager.common.ServerType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
public class ModDto {

    @Id
    private Long id;
    private String name;
    private String author;
    private String description;
    private String thumbnailUrl;
    private String hexId;
    private ServerType serverType;
    private Long fileSize;
    private String lastUpdated;
    private String installationStatus;
    private String errorStatus;
    private boolean serverOnly;
}
