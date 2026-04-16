package com.uniops.demo.service;

import com.uniops.demo.dto.asset.AssetRequestDTO;
import com.uniops.demo.dto.asset.AssetResponseDTO;
import com.uniops.demo.enums.AssetType;
import com.uniops.demo.enums.ResourceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AssetService {

    /**
     * Creates and stores a new asset resource.
     *
     * @param dto asset payload
     * @return created asset response
     */
    AssetResponseDTO createAsset(AssetRequestDTO dto);

    /**
     * Retrieves an asset by identifier.
     *
     * @param id asset identifier
     * @return asset response
     */
    AssetResponseDTO getAssetById(String id);

    /**
     * Retrieves all assets as a paginated result.
     *
     * @param pageable pagination and sorting configuration
     * @return paginated assets
     */
    Page<AssetResponseDTO> getAllAssets(Pageable pageable);

    /**
     * Searches assets using optional dynamic filters.
     *
     * @param type optional asset type
     * @param status optional status
     * @param location optional location fragment
     * @param subtype optional subtype fragment
     * @param pageable pagination and sorting configuration
     * @return paginated matching assets
     */
    Page<AssetResponseDTO> searchAssets(
            AssetType type,
            ResourceStatus status,
            String location,
            String subtype,
            Pageable pageable);

    /**
     * Fully updates an asset.
     *
     * @param id asset identifier
     * @param dto full update payload
     * @return updated asset response
     */
    AssetResponseDTO updateAsset(String id, AssetRequestDTO dto);

    /**
     * Updates only the status field of an asset.
     *
     * @param id asset identifier
     * @param status new status value
     * @return updated asset response
     */
    AssetResponseDTO updateAssetStatus(String id, ResourceStatus status);

    /**
     * Deletes an asset by identifier.
     *
     * @param id asset identifier
     */
    void deleteAsset(String id);
}

