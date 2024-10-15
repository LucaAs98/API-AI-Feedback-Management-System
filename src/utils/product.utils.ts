import { Prisma, PrismaClient, product as Product, film as Film, book as Book, music as Music, ProductType } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

type PrismaTransaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export type ProductCreationInput = {
  title: string;
  image: string;
  type: ProductType;
  genre_category: string;
};

export type FilmCreationInput = ProductCreationInput & {
  director: string;
  duration: number;
  description: string;
};

export type BookCreationInput = ProductCreationInput & {
  publisher: string;
  author: string;
  isbn: string;
  description: string;
};

export type MusicCreationInput = ProductCreationInput & {
  producer: string;
  artist: string;
  duration: number;
};

/**
 * Creates a new film entry in the database within a transaction.
 *
 * @param {PrismaTransaction} tx - The transaction object to perform database operations.
 * @param {FilmCreationInput} data - An object containing the film creation data, including director, duration, and description.
 * @param {number} productId - The unique identifier of the associated product for this film.
 * @returns {Promise<Film>} - A promise that resolves to the created film entry.
 * @throws {Error} - Throws an error if the creation operation fails.
 */
export const createFilm = async (tx: PrismaTransaction, data: FilmCreationInput, productId: number): Promise<Film> => {
  return await tx.film.create({
    data: {
      product_id: productId,
      director: data.director,
      duration: data.duration,
      description: data.description,
    },
  });
};

/**
 * Creates a new book entry in the database within a transaction.
 *
 * @param {PrismaTransaction} tx - The transaction object to perform database operations.
 * @param {BookCreationInput} data - An object containing the book creation data, including publisher, author, ISBN, and description.
 * @param {number} productId - The unique identifier of the associated product for this book.
 * @returns {Promise<Book>} - A promise that resolves to the created book entry.
 * @throws {Error} - Throws an error if the creation operation fails.
 */
export const createBook = async (tx: PrismaTransaction, data: BookCreationInput, productId: number): Promise<Book> => {
  return await tx.book.create({
    data: {
      product_id: productId,
      publisher: data.publisher,
      author: data.author,
      isbn: data.isbn,
      description: data.description,
    },
  });
};

/**
 * Creates a new music entry in the database within a transaction.
 *
 * @param {PrismaTransaction} tx - The transaction object to perform database operations.
 * @param {MusicCreationInput} data - An object containing the music creation data, including producer, artist, and duration.
 * @param {number} productId - The unique identifier of the associated product for this music entry.
 * @returns {Promise<Music>} - A promise that resolves to the created music entry.
 * @throws {Error} - Throws an error if the creation operation fails.
 */
export const createMusic = async (tx: PrismaTransaction, data: MusicCreationInput, productId: number): Promise<Music> => {
  return await tx.music.create({
    data: {
      product_id: productId,
      producer: data.producer,
      artist: data.artist,
      duration: data.duration,
    },
  });
};

/**
 * Maps a product to its final structure based on the type of product.
 * It combines the base product details with specific attributes based on the product type (Film, Book, Music).
 *
 * @param product - The input product object containing base product details and type-specific attributes.
 * @returns The final product object, which includes the combined details of the product, or null if the product type is not valid.
 *
 * @throws Error if the product type is not recognized.
 */
export function mapFinalProduct(product: any): (Product & (Partial<Film> | Partial<Book> | Partial<Music>)) | null {
  let finalProduct = { ...product }; // Create a copy of the input product to avoid mutating the original object.

  // Removes type-specific properties to avoid having the final output formatted incorrectly.
  delete finalProduct.film;
  delete finalProduct.book;
  delete finalProduct.music;

  // Determine the product type and merge specific attributes accordingly.
  switch (product.type as ProductType) {
    case ProductType.FILM:
      finalProduct = { ...finalProduct, ...product.film } as FilmCreationInput;
      break;
    case ProductType.BOOK:
      finalProduct = { ...finalProduct, ...product.book } as BookCreationInput;
      break;
    case ProductType.MUSIC:
      finalProduct = { ...finalProduct, ...product.music } as MusicCreationInput;
      break;
    default:
      throw new Error('Product type not valid!');
  }

  // Remove the internal specific product ID, because we already have it in the basic product.
  delete finalProduct.product_id;
  return finalProduct;
}

/**
 * Converts a string representation of a product type to the ProductType enum.
 *
 * @param {string} productTypeString - The string representation of the product type (e.g., 'FILM', 'BOOK', 'MUSIC').
 * @returns {ProductType} - The corresponding ProductType enum value.
 * @throws {Error} - Throws an error if the string does not match a valid product type.
 */
export const fromStringToProductType = (productTypeString: string): ProductType => {
  if (!Object.values(ProductType).includes(productTypeString as ProductType)) {
    throw new Error(`Product type "${productTypeString}" not valid!`);
  }

  return productTypeString as ProductType;
};
