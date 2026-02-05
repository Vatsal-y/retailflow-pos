package com.retailflow.pos.repository;

import com.retailflow.pos.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByStoreId(Long storeId);
    
    Page<Product> findByStoreId(Long storeId, Pageable pageable);
    
    List<Product> findByStoreIdAndCategoryId(Long storeId, Long categoryId);
    
    Optional<Product> findBySku(String sku);
    
    Optional<Product> findByBarcode(String barcode);
    
    @Query("SELECT p FROM Product p WHERE p.storeId = :storeId AND (p.name LIKE %:query% OR p.sku LIKE %:query% OR p.barcode LIKE %:query%)")
    List<Product> searchProducts(@Param("storeId") Long storeId, @Param("query") String query);
    
    Long countByStoreId(Long storeId);
}
