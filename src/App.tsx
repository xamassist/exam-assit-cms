import React from "react";

import { User as FirebaseUser } from "firebase/auth";
import {
    Authenticator,
    buildCollection,
    buildProperty,
    buildSchema,
    EntityReference,
    FirebaseCMSApp,
    NavigationBuilder,
    NavigationBuilderProps
} from "@camberi/firecms";

import "typeface-rubik";
import "typeface-space-mono";

// TODO: Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyBBEAcBVfPKkAIIejda7VviCS_giEAOHoc",
  authDomain: "examassist-b50d0.firebaseapp.com",
  databaseURL: "https://examassist-b50d0-default-rtdb.firebaseio.com",
  projectId: "examassist-b50d0",
  storageBucket: "examassist-b50d0.appspot.com",
  messagingSenderId: "1036639846334",
  appId: "1:1036639846334:web:a7e99a592fa7c0355883ef",
  measurementId: "G-9TV4Z67L9G"
};

const locales = {
    "en-US": "English (United States)",
    "es-ES": "Spanish (Spain)",
    "de-DE": "German"
};

type Product = {
    name: string;
    price: number;
    status: string;
    published: boolean;
    related_products: EntityReference[];
    main_image: string;
    tags: string[];
    description: string;
    categories: string[];
    publisher: {
        name: string;
        external_id: string;
    },
    expires_on: Date
}

type Document = {
    doc_title: string;
    code_aktu?: string;
    code_mjpru?: string;
    tag: string,
    subject_name:string;
    semester:number;
    branch:string;
    doc_type:number; // 0 - notes , 1 - paper , 2 - syllabus
    rating_count: number;
    avg_rating: number;
    view_count: number;
    upload_date: Date;
    uploader_name: string;
    uploader_id:string;
    paper_year?:number;
}
const docSchema = buildSchema<Document>({
    name: "Documents",
    properties: {
        doc_title: {
            title: "title",
            validation: { required: true },
            dataType: "string"
        },
        code_aktu: {
            title: "Code AKTU",
            dataType: "string"
        },
        code_mjpru: {
            title: "Code MJPRU",
            dataType: "string"
        },
        tag: {
            title: "Tags",
            validation: { required: true },
            dataType: "string"
        },
        subject_name: {
            title: "Subject name",
            validation: { required: true },
            dataType: "string"
        },
        semester: {
            title: "Semester",
            validation: { required: true },
            dataType: "number"
        },
        branch: {
            title: "Branch",
            validation: { required: true },
            dataType: "string"
        },
        doc_type: {
            title: "Document type",
            validation: { required: true },
            dataType: "number"
        },
        rating_count: {
            title: "Rating",
            dataType: "number"
        },
        avg_rating: {
            title: "Avg rating",
            dataType: "number"
        },
        view_count: {
            title: "View Count",
            dataType: "number"
        },
        upload_date: {
        title: "Upload Date",
        validation: { required: true },
        dataType: "timestamp"
        },
         paper_year:{
           title: "Paper year",
           dataType: "number"
        },
        uploader_id:{
            title: "Uploader Id",
            dataType: "string"
         },
         uploader_name:{
            title: "Uploader name",
            dataType: "string"
         }
    }
});

// const productSchema = buildSchema<Product>({
//     name: "Documents",
//     properties: {
//         name: {
//             title: "title",
//             validation: { required: true },
//             dataType: "string"
//         },
//         price: {
//             title: "Price",
//             validation: {
//                 required: true,
//                 requiredMessage: "You must set a price between 0 and 1000",
//                 min: 0,
//                 max: 1000
//             },
//             description: "Price with range validation",
//             dataType: "number"
//         },
//         status: {
//             title: "Status",
//             validation: { required: true },
//             dataType: "string",
//             description: "Should this product be visible in the website",
//             longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
//             config: {
//                 enumValues: {
//                     private: "Private",
//                     public: "Public"
//                 }
//             }
//         },
//         published: ({ values }) => buildProperty({
//             title: "Published",
//             dataType: "boolean",
//             columnWidth: 100,
//             disabled: (
//                 values.status === "public"
//                     ? false
//                     : {
//                         clearOnDisabled: true,
//                         disabledMessage: "Status must be public in order to enable this the published flag"
//                     }
//             )
//         }),
//         related_products: {
//             dataType: "array",
//             title: "Related products",
//             description: "Reference to self",
//             of: {
//                 dataType: "reference",
//                 path: "products"
//             }
//         },
//         main_image: buildProperty({ // The `buildProperty` method is an utility function used for type checking
//             title: "Image",
//             dataType: "string",
//             config: {
//                 storageMeta: {
//                     mediaType: "image",
//                     storagePath: "images",
//                     acceptedFiles: ["image/*"]
//                 }
//             }
//         }),
//         tags: {
//             title: "Tags",
//             description: "Example of generic array",
//             validation: { required: true },
//             dataType: "array",
//             of: {
//                 dataType: "string"
//             }
//         },
//         description: {
//             title: "Description",
//             description: "Not mandatory but it'd be awesome if you filled this up",
//             longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
//             dataType: "string",
//             columnWidth: 300
//         },
//         categories: {
//             title: "Categories",
//             validation: { required: true },
//             dataType: "array",
//             of: {
//                 dataType: "string",
//                 config: {
//                     enumValues: {
//                         electronics: "Electronics",
//                         books: "Books",
//                         furniture: "Furniture",
//                         clothing: "Clothing",
//                         food: "Food"
//                     }
//                 }
//             }
//         },
//         publisher: {
//             title: "Publisher",
//             description: "This is an example of a map property",
//             dataType: "map",
//             properties: {
//                 name: {
//                     title: "Name",
//                     dataType: "string"
//                 },
//                 external_id: {
//                     title: "External id",
//                     dataType: "string"
//                 }
//             }
//         },
//         expires_on: {
//             title: "Expires on",
//             dataType: "timestamp"
//         }
//     }
// });

const localeSchema = buildSchema({
    customId: locales,
    name: "Locale",
    properties: {
        title: {
            title: "Title",
            validation: { required: true },
            dataType: "string"
        },
        selectable: {
            title: "Selectable",
            description: "Is this locale selectable",
            dataType: "boolean"
        },
        video: {
            title: "Video",
            dataType: "string",
            validation: { required: false },
            config: {
                storageMeta: {
                    mediaType: "video",
                    storagePath: "videos",
                    acceptedFiles: ["video/*"]
                }
            }
        }
    }
});

export default function App() {

    const navigation: NavigationBuilder = async ({
                                                     user,
                                                     authController
                                                 }: NavigationBuilderProps) => {

        return ({
            collections: [
                buildCollection({
                    path: "products",
                    schema: docSchema,
                    name: "Documents",
                    permissions: ({ authController }) => ({
                        edit: true,
                        create: true,
                        // we have created the roles object in the navigation builder
                        delete: authController.extra.roles.includes("admin")
                    }),
                    subcollections: [
                        buildCollection({
                            name: "Locales",
                            path: "locales",
                            schema: localeSchema
                        })
                    ]
                })
            ]
        });
    };

    const myAuthenticator: Authenticator<FirebaseUser> = async ({
                                                                    user,
                                                                    authController
                                                                }) => {
        // You can throw an error to display a message
        if(user?.email?.includes("flanders")){
            throw Error("Stupid Flanders!");
        }
        
        console.log("Allowing access to", user?.email);
        // This is an example of retrieving async data related to the user
        // and storing it in the user extra field.
        const sampleUserData = await Promise.resolve({
            roles: ["admin"]
        });
        authController.setExtra(sampleUserData);
        return true;
    };

    return <FirebaseCMSApp
        name={"Exam Assist Console"}
        authentication={myAuthenticator}
        navigation={navigation}
        firebaseConfig={firebaseConfig}
    />;
}
