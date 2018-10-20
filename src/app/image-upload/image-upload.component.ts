import { Component, OnInit , EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  imgFile: File;
  @Input () buttonLine: string;
  @Output () imgEmitter: EventEmitter<string | ArrayBuffer> = new EventEmitter <string | ArrayBuffer>();

  constructor() { }

  ngOnInit() {
  }

  fileChanged (event: any) {
    let reader = new FileReader();
    this.imgFile = event.target.files[0];
    reader.readAsDataURL(this.imgFile);
    reader.onload = (event) => {
      const img = <FileReader> event.target;
      this.imgEmitter.emit(img.result);
    };
  }

}
