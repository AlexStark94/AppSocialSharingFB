import { Component } from '@angular/core';
import { ViewController, ToastController, Platform, LoadingController } from "ionic-angular";

//Plugins
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

//Providers
import { CargaArchivosService } from "../../providers/carga-archivos";

@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  titulo:string = "";
  imgPreview:string = null;
  img:string = "";

  constructor(private viewCtrl:ViewController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private _cas: CargaArchivosService,
              private platform: Platform,
              private camera: Camera,
              private imagePicker: ImagePicker) {
  }

  crear_post(){
    console.log("Subiendo imagen");

    let archivo = {
      'titulo': this.titulo,
      'img': this.img
    };

    let loader = this.loadingCtrl.create({
      content: "Subiendo..",
    });
    loader.present();

    this._cas.cargar_imagenes_firebase( archivo ).then(
      ()=>{
        loader.dismiss();
        this.cerrar_modal();
      },
      (err)=>{
        loader.dismiss();
        this.mostrar_toast("Error al cargar: " + err);
        console.log("Error al cargar: "+ JSON.stringify(err));
      }
    );
        
  }

  cerrar_modal(){
    this.viewCtrl.dismiss();
  }

  mostrar_camara(){

    if( !this.platform.is("cordova") ){
      this.mostrar_toast("Error, no estamos en un celular.");
      return;
    }

    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum:true
    }

    this.camera.getPicture(options).then((imageData) => {
     
      this.imgPreview = 'data:image/jpeg;base64,' + imageData;
      this.img = imageData;
      console.log("\n\n\n"+imageData+"\n\n\n");

    }, (err) => {
      
        this.mostrar_toast("Error: "+err);
        console.error("Error en la camara: ",err);

    });
  }

  seleccionar_fotos(){
    if( !this.platform.is("cordova") ){
      this.mostrar_toast("Error, no estamos en un celular.");
      return;
    }

    let options: ImagePickerOptions = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 60,
      outputType: 1
    };
    

    this.imagePicker.getPictures(options).then((results) => {

      for (let img of results){
        this.imgPreview = 'data:image/jpeg;base64,' + img;
        this.img = img;
        //this.img = this.img.replace(".jpg","");

        console.log("\n\n\n"+JSON.stringify(this.img)+"\n\n");

        break;
      }
    }, (err) => { 
      
      this.mostrar_toast("Error seleccion: "+ err);
      console.error("Error seleccion: "+ JSON.stringify(err))

    });
  }


  private mostrar_toast( texto:string ){
    this.toastCtrl.create({
      message:texto,
      duration:2500
    }).present();
  }

}
