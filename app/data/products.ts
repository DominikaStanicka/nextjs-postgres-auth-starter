// app/data/products.ts
export const products = [
    { 
      id: 1, 
      name: "Krem nawilżający", 
      description: "Doskonały krem nawilżający do twarzy.", 
      image: "/images/krem_nawilzajacy.jpg",
      rating: 4.5,
      reviews: [
        { user: "Anna", review: "Świetny krem, polecam!" },
        { user: "Maria", review: "Bardzo dobry nawilżacz." }
      ]
    },
    { 
      id: 2, 
      name: "Szampon regenerujący", 
      description: "Szampon do włosów zniszczonych.", 
      image: "/images/szampon_regenerujacy.jpg",
      rating: 4.7,
      reviews: [
        { user: "Kasia", review: "Zdecydowanie poprawił kondycję moich włosów." }
      ]
    },
    { 
      id: 3, 
      name: "Balsam do ciała", 
      description: "Nawilżający balsam o przyjemnym zapachu.", 
      image: "/images/balsam_do_ciala.jpg",
      rating: 4.2,
      reviews: [
        { user: "Joanna", review: "Idealny do skóry suchej, bardzo mi pomógł." }
      ]
    },
    { 
      id: 4, 
      name: "Serum przeciwzmarszczkowe", 
      description: "Zaawansowane serum do twarzy.", 
      image: "/images/serum_przeciwzmarszczkowe.jpg",
      rating: 4.8,
      reviews: [
        { user: "Karolina", review: "Moja skóra stała się gładka i jędrna!" },
        { user: "Olga", review: "Bardzo skuteczne serum, godne polecenia." }
      ]
    },
    { 
      id: 5, 
      name: "Pomadka ochronna", 
      description: "Pomadka chroniąca usta przed wysuszeniem.", 
      image: "/images/pomadka_ochronna.jpg",
      rating: 4.3,
      reviews: [
        { user: "Zofia", review: "Bardzo dobra pomadka, dobrze nawilża." }
      ]
    },
    { 
      id: 6, 
      name: "Mleczko do demakijażu", 
      description: "Delikatne mleczko oczyszczające skórę.", 
      image: "/images/mleczko_do_demakijazu.jpg",
      rating: 4.6,
      reviews: [
        { user: "Ewa", review: "Bardzo skuteczne mleczko, dobrze usuwa makijaż." }
      ]
    },
  ];
  