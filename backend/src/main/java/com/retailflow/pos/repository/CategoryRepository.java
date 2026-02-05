package com.retailflow.pos.repository;

import com.retailflow.pos.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findByStoreId(Long storeId);
    
    List<Category> findByStoreIdAndActive(Long storeId, Boolean active);
}
