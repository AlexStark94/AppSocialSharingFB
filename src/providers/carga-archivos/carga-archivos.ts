import { Injectable } from '@angular/core';

import { ToastController } from "ionic-angular";

import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";

@Injectable()
export class CargaArchivosProvider {

  private CARPETA_IMAGENES:string = "img";
  private POSTS:string = "posts";

  imagenes:any[] = [];
  lastKey:string = null;

  constructor( public af: AngularFireDatabase,
               private toastCtrl: ToastController ) {}

  cargar_imagenes_firebase( archivo:archivoSubir ){

    let promesa = new Promise((resolve, reject)=>{
        this.mostrar_toast("Inicio de carga");

        let storageRef = firebase.storage().ref();
        let nombreArchivo = new Date().valueOf();

        let uploadTask: firebase.storage.UploadTask = storageRef
        .child('${ this.CARPETA_IMAGENES }/${ nombreArchivo }')
        .putString( archivo.img, 'base64', { contentType: 'image/jpeg' } );

        uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
          ( snapshot )=>{}, //saber el avanze del archivo
          ( error )=>{ //Manejo de errores
            console.log( "Error al subir: "+JSON.stringify(error) );
            this.mostrar_toast("Error al cargar: "+JSON.stringify(error));
            reject(error);
          },
          ()=>{ //Termino el proceso
            
            let url = uploadTask.snapshot.downloadURL;
            this.mostrar_toast("Imagen cargada exitosamente.");
            this.crear_post( archivo.titulo, url );
            resolve();

          }
        ) 
      }
    );

  }

  private crear_post( titulo:string, url:string ){

    let post: archivoSubir = {
      img:url,
      titulo:titulo
    };

    let $key = this.af.database.ref('/${ this.POSTS }').push( post ).key;
    post.$key = $key;

    this.imagenes.push( post ); 

  }

  private mostrar_toast( texto:string ){
    this.toastCtrl.create({
      message:texto,
      duration:2500
    }).present();
  }

}

interface archivoSubir{
  $key?:string;
  img:string;
  titulo:string;
}