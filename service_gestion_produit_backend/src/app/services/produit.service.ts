import { Injectable } from '@angular/core';
import { Produit } from '../model/produit.model';
import { Categorie } from '../model/categorie.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategorieWrapper } from '../model/catgorieWrapped.model';
import { AuthService } from './auth.service';
import { Image } from '../model/image.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  produits!: Produit[];
  produit!: Produit;
  categories!: Categorie[];

  apiURL: string = 'http://localhost:8080/produits/api';
  apiURLCat: string = 'http://localhost:8080/produits/cat';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHttpHeaders(): HttpHeaders {
    let jwt = this.authService.getToken();
    jwt = 'Bearer ' + jwt;
    return new HttpHeaders({ 'Authorization': jwt });
  }

  listeProduit(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiURL}/all`, { headers: this.getHttpHeaders() });
  }

  ajouterProduit(prod: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiURL}/addprod`, prod, { headers: this.getHttpHeaders() });
  }

  supprimerProduit(id: number): Observable<void> {
    const url = `${this.apiURL}/delprod/${id}`;
    return this.http.delete<void>(url, { headers: this.getHttpHeaders() });
  }

  consulterProduit(id: number): Observable<Produit> {
    const url = `${this.apiURL}/getbyid/${id}`;
    return this.http.get<Produit>(url, { headers: this.getHttpHeaders() });
  }

  updateProduit(prod: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiURL}/updateprod`, prod, { headers: this.getHttpHeaders() });
  }

  listeCategories(): Observable<CategorieWrapper> {
    return this.http.get<CategorieWrapper>(this.apiURLCat, { headers: this.getHttpHeaders() });
  }

  consulterCategorie(id: number): Categorie {
    return this.categories.find((cat) => cat.idCat === id)!;
  }

  rechercherParCategorie(idCat: number): Observable<Produit[]> {
    const url = `${this.apiURL}/prodscat/${idCat}`;
    return this.http.get<Produit[]>(url);
  }

  rechercherParNom(nom: string): Observable<Produit[]> {
    const url = `${this.apiURL}/prodsByName/${nom}`;
    return this.http.get<Produit[]>(url);
  }

  ajouterCategorie(cat: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiURLCat, cat, httpOptions);
  }

  uploadImage(file: File, filename: string): Observable<Image> {
    const imageFormData = new FormData();
    imageFormData.append('image', file, filename);
    const url = `${this.apiURL}/image/upload`;
    return this.http.post<Image>(url, imageFormData);
  }

  loadImage(id: number): Observable<{ type: string; image: number[] }> {
    const url = `${this.apiURL}/image/get/info/${id}`;
    return this.http.get<{ type: string; image: number[] }>(url);
  }

  uploadImageProd(file: File, filename: string, idProd: number): Observable<any> {
    const imageFormData = new FormData();
    imageFormData.append('image', file, filename);
    const url = `${this.apiURL}/image/uploadImageProd/${idProd}`;
    return this.http.post<any>(url, imageFormData);
  }

  supprimerImage(id: number): Observable<void> {
    const url = `${this.apiURL}/image/delete/${id}`;
    return this.http.delete<void>(url, { headers: this.getHttpHeaders() });
  }
  uploadImageFS(file: File, filename: string, idProd : number): Observable<any> {
    const imageFormData = new FormData();
    imageFormData.append('image', file, filename);
    const url = `${this.apiURL + '/image/uploadFS'}/${idProd}`;
    return this.http.post(url, imageFormData);
  }
}
