package com.uniops.demo.service;

import com.uniops.demo.dto.asset.AssetRequestDTO;
import com.uniops.demo.dto.asset.AssetResponseDTO;
import com.uniops.demo.entity.Asset;
import com.uniops.demo.enums.AssetType;
import com.uniops.demo.enums.ResourceStatus;
import com.uniops.demo.exception.ResourceNotFoundException;
import com.uniops.demo.repository.AssetRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final ModelMapper modelMapper;
    private final MongoTemplate mongoTemplate;

    @Override
    public AssetResponseDTO createAsset(AssetRequestDTO dto) {
        log.info("Creating asset: {}", dto.getName());
        Asset asset = modelMapper.map(dto, Asset.class);
        LocalDateTime now = LocalDateTime.now();
        asset.setCreatedAt(now);
        asset.setUpdatedAt(now);
        Asset saved = assetRepository.save(asset);
        return toResponseDto(saved);
    }

    @Override
    public AssetResponseDTO getAssetById(String id) {
        log.info("Fetching asset with id: {}", id);
        return toResponseDto(findAssetById(id));
    }

    @Override
    public Page<AssetResponseDTO> getAllAssets(Pageable pageable) {
        return assetRepository.findAll(pageable).map(this::toResponseDto);
    }

    @Override
    public Page<AssetResponseDTO> searchAssets(
            AssetType type,
            ResourceStatus status,
            String location,
            String subtype,
            Pageable pageable) {

        Query query = new Query();

        if (type != null) {
            query.addCriteria(Criteria.where("assetType").is(type));
        }
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        if (location != null && !location.isBlank()) {
            query.addCriteria(Criteria.where("location").regex(location, "i"));
        }
        if (subtype != null && !subtype.isBlank()) {
            query.addCriteria(Criteria.where("assetSubtype").regex(subtype, "i"));
        }

        long total = mongoTemplate.count(query, Asset.class);
        query.with(pageable);

        List<Asset> assets = mongoTemplate.find(query, Asset.class);
        return new PageImpl<>(assets, pageable, total).map(this::toResponseDto);
    }

    @Override
    public AssetResponseDTO updateAsset(String id, AssetRequestDTO dto) {
        Asset asset = findAssetById(id);

        asset.setName(dto.getName());
        asset.setAssetType(dto.getAssetType());
        asset.setAssetSubtype(dto.getAssetSubtype());
        asset.setSerialNumber(dto.getSerialNumber());
        asset.setLocation(dto.getLocation());
        asset.setDescription(dto.getDescription());
        asset.setAvailabilityStart(dto.getAvailabilityStart());
        asset.setAvailabilityEnd(dto.getAvailabilityEnd());
        asset.setBookingDate(dto.getBookingDate());
        asset.setStatus(dto.getStatus());
        asset.setUpdatedAt(LocalDateTime.now());

        Asset updated = assetRepository.save(asset);
        return toResponseDto(updated);
    }

    @Override
    public AssetResponseDTO updateAssetStatus(String id, ResourceStatus status) {
        Asset asset = findAssetById(id);
        asset.setStatus(status);
        asset.setUpdatedAt(LocalDateTime.now());
        Asset updated = assetRepository.save(asset);
        return toResponseDto(updated);
    }

    @Override
    public void deleteAsset(String id) {
        log.info("Deleting asset with id: {}", id);
        Asset asset = findAssetById(id);
        assetRepository.delete(asset);
    }

    private Asset findAssetById(String id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
    }

    private AssetResponseDTO toResponseDto(Asset asset) {
        return modelMapper.map(asset, AssetResponseDTO.class);
    }
}

