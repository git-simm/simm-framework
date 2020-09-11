package test.framework.simm.service.impl.BizCardOcr;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.util.function.Function;

/**
 * 营业执照信息识别(横版)
 *
 * @author simm
 */
@Service("horizontal")
public class HorizontalCardOcrImpl extends BaseBizCardOcr {
    HorizontalCardOcrImpl() {
        //主图大小
        super(new int[]{3150, 1920});
    }

    @Override
    protected Function<String, int[]> getPartRect(BufferedImage bufferedImage) {
        return type -> {
            switch (type) {
                case "name":
                    return new int[]{520, 700, 1200, 120};
                case "capital":
                    return new int[]{2170, 720, bufferedImage.getWidth() - 2400, 120};
                case "bizType":
                    return new int[]{520, 820, 1200, 130};
                case "buildOn":
                    return new int[]{2170, 850, bufferedImage.getWidth() - 2400, 100};
                case "juridical":
                    return new int[]{520, 950, 1200, 120};
                case "bizLimit":
                    return new int[]{2170, 970, bufferedImage.getWidth() - 2400, 100};
                case "bizScope":
                    return new int[]{520, 1070, 1330, bufferedImage.getHeight() - 1200};
                case "address":
                    return new int[]{2170, 1070, bufferedImage.getWidth() - 2240, 270};
                case "creditCode":
                    return new int[]{bufferedImage.getMinX() + 200, 250, 550, 300};
                default:
                    return new int[3];
            }
        };
    }
}
