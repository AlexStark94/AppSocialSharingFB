import { Component } from '@angular/core';
import { NavController, ModalController,ToastController } from 'ionic-angular';

import { SubirPage } from "../subir/subir";

//providers
import { CargaArchivosService } from "../../providers/carga-archivos";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

//Plugins
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hayMas:boolean = true;


  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              private _cas: CargaArchivosService,
              private _auth: AuthServiceProvider,
              private socialSharing: SocialSharing,
              private toastCtrl: ToastController) {
      this._cas.cargar_imagenes();
  }

  salir(){
    this._auth.signOut();
  }

  ingresar(): void {
    this._auth.signInWithFacebook()
      .then(() => this.onSignInSuccess());
  }

  private onSignInSuccess(): void {
    console.log("Facebook nombre ",this._auth.displayName());
  }


  cargar_siguientes(infiteScroll:any){
    console.log("Siguientes...");
    this._cas.cargar_imagenes()
    .then(
      ( existenMas:boolean )=>{
        infiteScroll.complete();
        console.log( existenMas );
        this.hayMas = existenMas;
      }
    )
  }

  compartir( mensaje, imagen, url ){
    this.socialSharing.shareViaFacebook('ESTO ES UN MENSAJE', imagen).then(() => {
      this.toastCtrl.create({
        message: "Compartido correctamente",
        duration: 2500
      }).present();
    }).catch(( error ) => {
        this.toastCtrl.create({
        message: error,
        duration: 2500
      }).present();
    });
  }

  mostrar_modal(){
    let modal = this.modalCtrl.create( SubirPage );
    modal.present();
  }

}
