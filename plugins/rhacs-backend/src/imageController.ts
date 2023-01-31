/**
 * Image controller that keeps a specific image to show in RHACS plugin
 * This will be change to manage multiple images with DB in the future
 */

type ImageInfo = {
  imageReference: string
  imageSha: string
  imageOwner: string
  imageName: string
}

export class ImageController {
  imageReference: string
  imageSha: string
  imageOwner: string
  imageName: string

  constructor() {
    this.imageReference = '';
    this.imageSha = '';
    this.imageOwner = '';
    this.imageName = '';
  }

  setImage(ref: string, sha: string, owner?: string, name?: string) {
    this.imageReference = ref;
    this.imageSha = sha;
    this.imageOwner = owner ? owner : '';
    this.imageName = name ? name : '';
  }

  getImage() {
    return {
      imageReference: this.imageReference,
      imageSha: this.imageSha,
      imageOwner: this.imageOwner,
      imageName: this.imageName,
    } as ImageInfo;
  }
}

// Singleton
export const currentImage = new ImageController()
