@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FeignClient {
    /**
     * 说明：
     * 1、value 与 name 互为别名，两者二选一即可
     * 2、当 contextId 没有值的时候，会默认获取（value/name）的值
     * 3、当未指定 url 请求地址的时候，最终会通过 ribbon-loadbalancer工具，从consul注册节点中选取 service-id 等于 value的服务作为请求地址
     * @return
     */
    @AliasFor("name")
    String value() default "";
    /**
     * 说明：
     * 1、serviceId 已经作废，其目的与 value一致。如果设置了 serviceId，则value/name 皆以 serviceId 为准
     */
    /** @deprecated */
    @Deprecated
    String serviceId() default "";
    /**
     * 说明：
     * 1、当 contextId 没有值的时候，会默认获取（value/name）的值
     * 2、当 qualifier 没有值的时候，会将 '${contextId}FeignClient'作为 feign 的bean组件别名
     */
    String contextId() default "";
    /**
     * 说明：同 value, 二选一
     */
    @AliasFor("value")
    String name() default "";
    /**
     * 说明：
     * 1、feign的bean组件别名，拥有最高优先级；
     * 2、当 qualifier 为空时，取 '${contextId}FeignClient' 作为 bean 的名称
     */
    String qualifier() default "";
    /**
     * 说明：
     * 1、设置 url 以后，后续发起http调用时，直接读取该地址作为请求目标；
     * 2、未设置 url 时，借助 ribbon-loadbalancer 组件，根据 (value/name)从consul的服务列表中选中service-id匹配的目标服务；
     */
    String url() default "";

    boolean decode404() default false;

    Class<?>[] configuration() default {};

    Class<?> fallback() default void.class;

    Class<?> fallbackFactory() default void.class;
    /**
     * 说明：
     * 目标服务器 对应的资源 uri （FeignClient下所有方法相同的path路径）
     */
    String path() default "";

    boolean primary() default true;
}
