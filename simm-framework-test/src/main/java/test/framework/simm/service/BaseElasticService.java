package test.framework.simm.service;

import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import test.framework.simm.model.ElasticEntity;

import java.util.Collection;
import java.util.List;

/**
 * 基础操作类
 * @author simm
 */
public interface BaseElasticService {
    String createIndex(String idxName);
    boolean indexExist(String idxName) throws Exception;
    boolean isExistsIndex(String idxName) throws Exception;
    void buildSetting(CreateIndexRequest request);
    void insertOrUpdateOne(String idxName, ElasticEntity entity);
    void insertBatch(String idxName, List<ElasticEntity> list);
    <T> void deleteBatch(String idxName, Collection<T> idList);
    <T> List<T> search(String idxName, SearchSourceBuilder builder, Class<T> c);
    void deleteIndex(String idxName);
    void deleteByQuery(String idxName, QueryBuilder builder);
}
