package simm.boot.test.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 压缩服务测试
 *
 * @author miscr
 */
@Service
@Slf4j
public class ZipService {
    public static void main(String[] args) {
        // 配置线程池参数
        // 核心线程数
        int corePoolSize = 10;
        // 最大线程数
        int maxPoolSize = 10;
        // 线程空闲时间
        long keepAliveTime = 0L;
        // 时间单位
        TimeUnit unit = TimeUnit.MILLISECONDS;
        // 有界工作队列
        BlockingQueue<Runnable> workQueue = new ArrayBlockingQueue<>(10);
        // 创建线程池
        ThreadPoolExecutor executor = new ThreadPoolExecutor(corePoolSize, maxPoolSize, keepAliveTime, unit, workQueue);

        // 提交任务给线程池
        ZipService zipService = new ZipService();
        for (int i = 0; i < 20; i++) {
            final int taskId = i;
            executor.submit(() -> {
                // 任务逻辑，可以根据需求修改
                zipService.downloadZip(UUID.randomUUID().toString(), taskId);
            });
        }
        // 关闭线程池
        executor.shutdown();
    }

    private ResponseEntity<InputStreamResource> downloadZip(String zipName, int taskId) {
        log.debug("[{}]开始压缩,{}", taskId, zipName);
        try {
            // 源文件目录，可以根据实际情况修改
            String sourceDirectory = "E:/tools";
            // 压缩后的ZIP文件
            String zipFilePath = String.format("E:/test-zip/%s.zip", zipName);

            // 创建ZIP输出流
            FileOutputStream fos = new FileOutputStream(zipFilePath);
            ZipOutputStream zipOut = new ZipOutputStream(fos);

            // 获取源文件夹下的所有文件，并添加到ZIP中
            File sourceDir = new File(sourceDirectory);
            addFilesToZip(sourceDir, sourceDir, zipOut);

            // 关闭ZIP输出流
            zipOut.close();
            fos.close();

            // 构造响应
            File zipFile = new File(zipFilePath);
            InputStreamResource resource = new InputStreamResource(new FileInputStream(zipFile));

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=file.zip");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(zipFile.length())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            log.debug("[{}]压缩完毕,{}", taskId, zipName);
        }
    }

    private void addFilesToZip(File sourceDir, File file, ZipOutputStream zipOut) throws IOException {
        if (file.isDirectory()) {
            for (String fileName : Objects.requireNonNull(file.list())) {
                addFilesToZip(sourceDir, new File(file, fileName), zipOut);
            }
        } else {
//            log.debug("开始压缩文件," + file.getName());
            try (FileInputStream fis = new FileInputStream(file)) {
                String entryName = file.getAbsolutePath().substring(sourceDir.getAbsolutePath().length() + 1);
                ZipEntry zipEntry = new ZipEntry(entryName);
                zipOut.putNextEntry(zipEntry);

                byte[] bytes = new byte[1024];
                int length;
                while ((length = fis.read(bytes)) >= 0) {
                    zipOut.write(bytes, 0, length);
                }
            }
//            log.debug("压缩文件结束," + file.getName());
        }
    }
}
