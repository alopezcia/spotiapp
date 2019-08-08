import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent  {

  newReleases: any[]=[];
  loading: boolean;
  error: boolean;
  mensajeError: string;

  constructor( private spotify: SpotifyService ) {
    this.loading = true;
    this.error = false;
    this.mensajeError = '';

    if( this.spotify.tokenExpirado() ){
      this.spotify.getSpotifyToken().subscribe( (data:any) =>{
        spotify.access_token = data['access_token'];
        spotify.token_type = data['token_type'];
        spotify.expires_in = data['expires_in'];
        this.spotify.getNewReleases().subscribe( (resp: any) => {
          this.newReleases = resp;
          this.loading = false;
        }, ( errorSpotify ) => {
          this.loading = false;
          this.mensajeError = errorSpotify.message;
          this.error = true;
        });
      }, ( errorServiciosAmaem ) => {
        this.loading = false;
        this.mensajeError = errorServiciosAmaem.message;
        this.error = true;
      });
    } else {
      this.spotify.getNewReleases().subscribe( (resp: any) => {
        this.newReleases = resp;
        this.loading = false;
      }, ( errorSpotify ) => {
        this.loading = false;
        this.mensajeError = errorSpotify.message;
        this.error = true;
      });
    }
  }

}
