import { Component, OnInit , EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-profile-image-upload',
  templateUrl: './profile-image-upload.component.html',
  styleUrls: ['./profile-image-upload.component.css']
})
export class ProfileImageUploadComponent implements OnInit {
  imgFile: File;     
  @Input () buttonLine: string;
  @Output () imgEmitter: EventEmitter<string> = new EventEmitter <string>();

  constructor() { }

  ngOnInit() {
  }

  fileChanged (event: any) {
    var reader = new FileReader();
    this.imgFile = event.target.files[0];
    reader.readAsDataURL(this.imgFile)
    reader.onload = (event) => {
    var img = <FileReader>event.target;
        this.imgEmitter.emit (img.result); 
    }
}

}