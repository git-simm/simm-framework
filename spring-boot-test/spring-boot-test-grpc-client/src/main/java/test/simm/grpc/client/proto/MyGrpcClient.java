/*
 * Copyright 2016 Google, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package test.simm.grpc.client.proto;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import test.simm.grpc.GreetingRequest;
import test.simm.grpc.GreetingResponse;
import test.simm.grpc.MyServiceGrpc;

/**
 * @author rayt
 * @date 5/16/16
 */
public class MyGrpcClient {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 8588)
                .usePlaintext()
                .build();

        MyServiceGrpc.MyServiceBlockingStub stub = MyServiceGrpc.newBlockingStub(channel);

        GreetingResponse helloResponse = stub.greeting(
                GreetingRequest.newBuilder()
                        .setName("司满")
                        .build());

        System.out.println(helloResponse);

        channel.shutdown();
    }
}
