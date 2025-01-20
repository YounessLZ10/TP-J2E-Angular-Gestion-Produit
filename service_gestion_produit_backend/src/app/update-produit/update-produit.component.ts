import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../services/produit.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categorie } from '../model/categorie.model';
import { Image } from '../model/image.model';


@Component({
  selector: 'app-update-produit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-produit.component.html',
  styles: ``,
})
export class UpdateProduitComponent implements OnInit {
  currentProduit = new Produit();
  produits!: Produit[]; // Définir produits ici

  categories!: Categorie[];
  updatedCatId!: number;
  myimage!: string;

  uploadedImage!: File;
  isImageUpdated: Boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    // Charger les catégories
    this.produitService.listeCategories().subscribe((cats) => {
      console.log(cats);
      this.categories = cats._embedded.categories;
    });

    // Charger les détails du produit
    this.produitService
      .consulterProduit(this.activatedRoute.snapshot.params['id'])
      .subscribe((prod) => {
        this.currentProduit = prod;
        this.updatedCatId = prod.categorie.idCat;

        // Charger l'image associée au produit
        if (this.currentProduit.Image && this.currentProduit.Image.idImage) {
          this.produitService
            .loadImage(this.currentProduit.Image.idImage)
            .subscribe((img: { type: string; image: number[] }) => {
              this.myimage = 'data:' + img.type + ';base64,' + img.image;
            });
        }
      });
  }

  onImageUpload(event: any) {
    if (event.target.files && event.target.files.length) {
      this.uploadedImage = event.target.files[0];
      this.isImageUpdated = true;
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedImage);
      reader.onload = () => {
        this.myimage = reader.result as string;
      };
    }
  }

  onAddImageProduit() {
    this.produitService
      .uploadImageProd(
        this.uploadedImage,
        this.uploadedImage.name,
        this.currentProduit.idProduit
      )
      .subscribe((img: Image) => {
        if (!this.currentProduit.images) {
          this.currentProduit.images = [];
        }
        this.currentProduit.images.push(img);
      });
  }

  supprimerImage(img: Image) {
    let conf = confirm("Etes-vous sûr ?");
    if (conf) {
      this.produitService.supprimerImage(img.idImage).subscribe(() => {
        const index = this.currentProduit.images.indexOf(img, 0);
        if (index > -1) {
          this.currentProduit.images.splice(index, 1);
        }
      });
    }
  }

  updateProduit() {
    this.currentProduit.categorie = this.categories.find(
      (cat) => cat.idCat === this.updatedCatId
    )!;
    if (this.isImageUpdated) {
      this.produitService
        .uploadImage(this.uploadedImage, this.uploadedImage.name)
        .subscribe((img: Image) => {
          this.currentProduit.Image = img;
          this.produitService.updateProduit(this.currentProduit).subscribe(() => {
            this.router.navigate(['produits']);
          });
        });
    } else {
      this.produitService.updateProduit(this.currentProduit).subscribe(() => {
        this.router.navigate(['produits']);
      });
    }
  }

  // Correction de la méthode chargerProduits pour afficher les images
  chargerProduits() {
    this.produitService.listeProduit().subscribe(prods => {
      this.produits.forEach((prod: Produit) => {
        if (prod.images && prod.images.length > 0) {
          // Si le produit a des images, on charge la première image
          prod.imageStr = 'data:' + prod.images[0].type + ';base64,' + prod.images[0].image;
        }
      });

    });
  }
}
