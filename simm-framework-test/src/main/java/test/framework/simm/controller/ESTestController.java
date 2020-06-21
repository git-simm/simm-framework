package test.framework.simm.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import test.framework.simm.model.ElasticEntity;
import test.framework.simm.service.BaseElasticService;

/**
 * es测试
 * @author simm
 */
@Api(value = "ES测试接口", tags = {"ES测试接口"})
@RestController
@RequestMapping("/es")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT})
@Slf4j
public class ESTestController {
    private final static String _key = "user";
    @Autowired
    private BaseElasticService baseElasticService;
    @ApiOperation(value = "es测试创建索引接口", notes = "es测试创建索引接口")
    @RequestMapping(value = "/create/index", method = RequestMethod.POST)
    public Object createIndex() {
        return baseElasticService.createIndex(_key);
    }

    @ApiOperation(value = "es测试是否存在索引接口", notes = "es测试是否存在索引接口")
    @RequestMapping(value = "/index/exists", method = RequestMethod.POST)
    public Object indexExists(@RequestParam String indexName) {
        return null;
    }

    @ApiOperation(value = "es测试删除索引接口", notes = "es测试删除索引接口")
    @RequestMapping(value = "/delete/index", method = RequestMethod.POST)
    public Object deleteIndex(@RequestParam String indexName) {
        baseElasticService.deleteIndex(_key);
        return 1;
    }

    @ApiOperation(value = "es测试插入接口", notes = "es测试插入接口")
    @RequestMapping(value = "/insert/data", method = RequestMethod.POST)
    public Object addUser(@RequestBody ElasticEntity user) {
        baseElasticService.insertOrUpdateOne(_key,user);
        return 1;
    }

    @ApiOperation(value = "es测试普通查询接口", notes = "es测试普通查询接口")
    @RequestMapping(value = "/query/data", method = RequestMethod.POST)
    public Object testESFind(@RequestBody ElasticEntity user) {
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder boolQuery = new BoolQueryBuilder();
        if(!StringUtils.isEmpty(user.getName())){
            // termQuery 只能查询一个字
            boolQuery.must(QueryBuilders.termQuery("name", user.getName()));
        }
        if(!StringUtils.isEmpty(user.getAddress())){
            boolQuery.must(QueryBuilders.matchQuery("address", user.getAddress()));
        }
//        boolQuery.must(QueryBuilders.wildcardQuery("host", "10.229.208.*"));
//        boolQuery.mustNot(QueryBuilders.matchQuery("message", "DISPLAY_CMDRECORD"));
//        boolQuery.mustNot(QueryBuilders.matchQuery("message", "SUPPRESS_LOG"));
//        boolQuery.filter(QueryBuilders.rangeQuery("@timestamp").gte(start).lte(end));
        searchSourceBuilder.query(boolQuery);
        String[] includeFields = new String[] {"name", "age","address"};
        String[] excludeFields = new String[] {};
        searchSourceBuilder.fetchSource(includeFields, excludeFields);
        return baseElasticService.search(_key,searchSourceBuilder,ElasticEntity.class);
    }

    @ApiOperation(value = "es测试聚合查询接口", notes = "es测试聚合查询接口")
    @RequestMapping(value = "/query/agg", method = RequestMethod.GET)
    public Object testESFindAgg() {
        return null;
    }

    @ApiOperation(value = "es测试更新接口", notes = "es测试更新接口")
    @RequestMapping(value = "/update/data", method = RequestMethod.GET)
    public Object testESUpdate(@RequestParam String id, @RequestParam Double money) {
        return null;
    }

    @ApiOperation(value = "es测试删除接口", notes = "es测试删除接口")
    @RequestMapping(value = "/delete/data", method = RequestMethod.GET)
    public Object testESDelete(@RequestParam String id, @RequestParam String indexName) {
        return null;
    }
}