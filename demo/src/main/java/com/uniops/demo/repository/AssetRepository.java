package com.uniops.demo.repository;

import com.uniops.demo.entity.Asset;
import com.uniops.demo.enums.AssetType;
import com.uniops.demo.enums.ResourceStatus;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AssetRepository extends MongoRepository<Asset, String> {

    List<Asset> findByAssetType(AssetType type);

    List<Asset> findByStatus(ResourceStatus status);

    List<Asset> findByLocationContainingIgnoreCase(String location);

    List<Asset> findByAssetSubtypeContainingIgnoreCase(String subtype);
}
