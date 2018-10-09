import { Component } from '@angular/core';
import { Output, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-imgup',
    templateUrl: './imgup.component.html'
})

// Component adapted from:
// https://academind.com/learn/angular/snippets/angular-image-upload-made-easy/
export class ImageUploadComponent {
    imgFile: File;     
    @Input () buttonLine: string;
    @Output () imgEmitter: EventEmitter<string> = new EventEmitter <string>();

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
