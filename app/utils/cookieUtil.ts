// import Cookies from 'js-cookie';

// const REC_COOKIE_NAME = 'rec';

// export const getRecFromCookie = () => {
//   const rec = Cookies.get(REC_COOKIE_NAME);
//   return rec ? JSON.parse(rec) : [];
// };

// export const saveRecToCookie = (rec: any[]) => {
//   Cookies.set(REC_COOKIE_NAME, JSON.stringify(rec), { expires: 7 }); // Cookie expires in 7 days
// };

// export const clearRecCookie = () => {
//   Cookies.remove(REC_COOKIE_NAME);
// };
//---------------------
import Cookies from 'js-cookie';

interface Product {
  id: string;
  name: string;
}

interface Review {
  product_id: string;
  rating: number | "";
  review: string;
}

const REC_COOKIE_NAME = 'rec';

export const getRecFromCookie = () => {
  const rec = Cookies.get(REC_COOKIE_NAME);
  return rec ? JSON.parse(rec) : null;
};

export const saveRecToCookie = (rec: Review) => {
  Cookies.set(REC_COOKIE_NAME, JSON.stringify(rec), { expires: 7 }); // Cookie expires in 7 days
};

export const clearRecCookie = () => {
  Cookies.remove(REC_COOKIE_NAME);
};
