import ImagePicker, { Options, Image } from 'react-native-image-crop-picker';
import { toast } from '../toastMessage/toast';

export interface PickImageOptions extends Partial<Options> {
  fromCamera?: boolean;
  showToast?: boolean;
}

export interface PickedImageResult {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

export const pickImage = async (
  options?: PickImageOptions
): Promise<PickedImageResult | null> => {
  try {
    const config: Options = {
      width: 800,
      height: 800,
      cropping: true,
      compressImageQuality: 0.8,
      cropperToolbarTitle: 'Crop Photo',
      mediaType: 'photo',
      ...options,
    };

    const picker = (ImagePicker as any)?.openPicker
      ? ImagePicker
      : require('react-native-image-crop-picker').default || require('react-native-image-crop-picker');

    const image: Image = options?.fromCamera
      ? await picker.openCamera(config)
      : await picker.openPicker(config);

    if (!image?.path) return null;

    const uri = image.path;
    const name = image.filename || uri.split('/').pop() || `photo_${Date.now()}.jpg`;
    const type = image.mime || 'image/jpeg';

    return { uri, type, name, size: image.size };
  } catch (error: any) {
    if (error?.code === 'E_PICKER_CANCELLED') {
      return null;
    }
    const message = error?.message || 'Failed to select image';
    if (options?.showToast ?? true) {
      toast.error(message);
    }
    return null;
  }
};

