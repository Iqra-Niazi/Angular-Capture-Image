import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('video', { static: false })
  videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  previewImage: any;
  videoTransform: string = 'scaleX(-1)';
  showImageModal: boolean = false;

  constructor() {}

  ngOnInit() {}
  toPng(media: ImageBitmap | HTMLVideoElement): string | ArrayBuffer {
    let width: number;
    let height: number;

    if (media instanceof ImageBitmap) {
      console.log('image');
      width = media.width;
      height = media.height;
    } else {
      throw new Error('Unsupported media type');
    }
    let context = this.canvas.getContext('2d', { desynchronized: true });
    if (context) {
      context.drawImage(media, 0, 0, width, height);
    }
    return this.canvas.toDataURL('image/png');
  }

  openCamera() {
    this.canvas = this.canvasRef.nativeElement;
    this.video = this.videoRef.nativeElement;
    // Set up video stream and dimensions
    this.getStream().then(() => {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.showImageModal = true;
    });
  }

  closeCamera() {
    this.showImageModal = false;
    this.previewImage = '';
  }
  grabFrame() {
    const context = this.canvas.getContext('2d', { desynchronized: true });
    if (context) {
      context.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.previewImage = this.canvas.toDataURL('image/png');
    }
  }

  getStream(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { ideal: 0 },
            height: { ideal: 0 },
            facingMode: 'environment',
          },
        })
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.onloadedmetadata = () => {
            this.video.play();
            resolve();
          };
        })
        .catch((error) => {
          this.handleError(error);
          reject(error);
        });
    });
  }
  uploadImage(event: any) {
    if (this.previewImage) {
      // this.showImageModal = false
      // Convert captured image to base64
      const base64Image = this.previewImage.split(',')[1];

      // Create an array of base64 images
      const base64Array = [base64Image];

      // Convert base64 array to array of Blobs
      const blobsArray = this.convertBase64ToBlobArray(
        base64Array,
        'image/jpeg'
      );

      event = { files: blobsArray };
      console.log(event);
    }
  }
  private convertBase64ToBlobArray(
    base64Array: string[],
    type: string
  ): File[] {
    const files: File[] = [];

    for (const base64 of base64Array) {
      const binary = atob(base64);
      const uint8Array = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        uint8Array[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: type });
      const fileName = this.generateFileName();
      const file = new File([blob], fileName, { type: type });
      console.log(fileName);
      files.push(file);
      console.log(files);
    }
    return files;
  }
  private generateFileName(): string {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    return `img_${timestamp}_.jpg`;
  }
  handleError(error: any) {
    console.log('Error: ', error);
  }
}
