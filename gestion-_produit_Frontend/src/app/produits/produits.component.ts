import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit.model';
import { ProduitService } from '../services/produit.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Image } from '../model/image.model';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits!: Produit[]; // un tableau de Produit

  constructor(private produitService: ProduitService, public authService: AuthService) {}

  ngOnInit() {
    this.chargerProduits();
  }

  chargerProduits() {
    this.produitService.listeProduit().subscribe(prods => {
      console.log(prods);
      this.produits = prods; // Assurez-vous d'assigner les produits ici

      this.produits.forEach(prod => {
        if (prod.Image) { // Corriger la propriété image
          if (prod.Image.idImage) { // Vérifier si l'image a un id
            this.produitService.loadImage(prod.Image.idImage).subscribe((img: { type: string; image: number[] }) => {
              prod.imageStr = 'data:' + img.type + ';base64,' + img.image;
            });


          }
        }
      });
    });
  }

  supprimerProduit(p: Produit) {
    let conf = confirm("Etes-vous sûr ?");
    if (conf) {
      this.produitService.supprimerProduit(p.idProduit).subscribe(() => {
        console.log("Produit supprimé");
        this.chargerProduits(); // Recharger la liste après suppression
      });
    }
  }
}
