import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: []
})
export class SearchComponent {

  loading: boolean;
  error: boolean;
  mensajeError: string;

  artists: any[] = [];

  constructor(private spotify: SpotifyService) { 
    this.error = false;
    this.mensajeError = '';
  }

  buscar(termino: string){
    if( termino.length > 0 ){
      this.loading = true;

      if( this.spotify.tokenExpirado() ){
        this.spotify.getSpotifyToken().subscribe( (data:any) =>{
          this.spotify.access_token = data['access_token'];
          this.spotify.token_type = data['token_type'];
          this.spotify.expires_in = data['expires_in'];
          this.spotify.getArtistas(termino).subscribe( (resp: any) => {
            this.artists = resp;
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
        this.spotify.getArtistas(termino).subscribe( (resp: any) => {
          this.artists = resp;
          this.loading = false;
        }, ( errorSpotify ) => {
          this.loading = false;
          this.mensajeError = errorSpotify.message;
          this.error = true;
        });
      }
    }
  }

}
