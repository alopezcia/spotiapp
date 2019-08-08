import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  styles: []
})
export class ArtistaComponent {
  loading: boolean;
  error: boolean;
  mensajeError: string;
  artista: any = {};
  topTracks: any[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private spotify: SpotifyService ) { 
    this.error = false;
    this.mensajeError = '';
    this.loading = true;
    this.activatedRoute.params.subscribe( params => {
      this.getArtista(params.id);
    });
  }

  getArtista( id: string ){
    this.loading = true;
    if ( this.spotify.tokenExpirado() ){
      this.spotify.getSpotifyToken().subscribe( (data:any) => {
        this.spotify.access_token = data['access_token'];
        this.spotify.token_type = data['token_type'];
        this.spotify.expires_in = data['expires_in'];
        this.spotify.getArtista( id ).subscribe( params => {
          this.getTopTracks(id);
          this.artista = params;
        }, ( errorSpotify ) => {
          this.loading = false;
          this.mensajeError = errorSpotify.menssage;
          this.error = true;
        });
      }, ( errorServiciosAmaem ) => {
        this.loading = false;
        this.mensajeError = 'Error Servicios AMAEM';
        console.log(errorServiciosAmaem);
        this.error = true;
      });
    } else {
      this.spotify.getArtista( id ).subscribe( params => {
        this.getTopTracks(id);
        this.artista = params;
      }, ( errorSpotify ) => {
        this.loading = false;
        this.mensajeError = errorSpotify.menssage;
        this.error = true;
      });
    }
  }

  getTopTracks( id: string ){
    if ( this.spotify.tokenExpirado() ){
      this.spotify.getSpotifyToken().subscribe( (data:any) => {
        this.spotify.access_token = data['access_token'];
        this.spotify.token_type = data['token_type'];
        this.spotify.expires_in = data['expires_in'];
        this.spotify.getTopTracks( id ).subscribe( params => {
          this.topTracks = params;
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
      this.spotify.getTopTracks( id ).subscribe( params => {
        this.topTracks = params;
        this.loading = false;
      }, ( errorSpotify ) => {
        this.loading = false;
        this.mensajeError = errorSpotify.message;
        this.error = true;
      });
    }
  }



}
