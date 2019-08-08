import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  access_token: string;
  token_type: string;
  expires_in: number;
  last_request: Date;

  constructor( private http: HttpClient ) {
  }

  getSpotifyToken(): any {
    this.last_request = new Date();
    console.log('Solicitando token a las ' + this.last_request );
    return this.http.get(`https://www.servicios-amaem.es/raspberry/spotify`);
  }

  getQuery(query: string): any {
    const bearerToken: string = this.token_type + ' ' + this.access_token;
    const headers = new HttpHeaders({'Authorization': bearerToken});
    return this.http.get(`https://api.spotify.com/v1/${query}`, {headers});
  }

  getNewReleases(){
      return this.getQuery('browse/new-releases?limit=20')
        .pipe(map(data => data['albums'].items ));
  }

  getArtistas(termino: string) {
      return this.getQuery(`search?q=${termino}&type=artist&limit=15`)
        .pipe(map(data => data['artists'].items ));
  }

  getArtista( id: string ){
    return this.getQuery(`artists/${ id }`);
  }

  getTopTracks( id: string ){
    return this.getQuery(`artists/${ id }/top-tracks?country=US`)
      .pipe(map(data => data['tracks'] ));

  }

  tokenExpirado(): boolean {
    if ( this.last_request == null ){
      return true;
    } else {
      const ahora = new Date();
      const diferencia = Math.round(Math.abs(ahora.valueOf() - this.last_request.valueOf()) / 1000);
      console.log( 'Último token solicitado hace ' + diferencia + ' segundos' );
      return ( diferencia >= this.expires_in );
    }
  }
}
