package com.surplus360.repository;

import com.surplus360.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, String> {

    @Query("select a from Authority a where a.name = :name")
    Optional<Authority> findByName(@Param("name") String name);

    @Query("select a from Authority a order by a.name")
    List<Authority> findAllOrderByName();

    @Query("select a from Authority a where a.name like %:namePattern%")
    List<Authority> findByNameContaining(@Param("namePattern") String namePattern);

    @Query("select count(a) from Authority a")
    long countAll();

    boolean existsByName(String name);
}