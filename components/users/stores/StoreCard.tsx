import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";


interface IProps{
   store:{ id: string;
    name: string;
    logo: string | null;
    city: string;
    address:string;
    description:string
   }
  }

export default function StoreCard({store}:IProps){

    return(
        <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          border: "1px solid black",
          boxShadow: "none",
        }}
      >
      <CardMedia
          sx={{ height: 200, position: 'relative',borderBottom:"1px solid" }}
        >
          <Image
            src={store.logo || ''}
            alt={store.name}
            layout="fill"
           
          />
        </CardMedia>
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {store.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {store.description}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", mt: "auto" }}>
          <Link href={`/stores/${store.id}/${store.name}`} passHref>
          <Button
            size="medium"
            variant="contained"
            sx={{
              bgcolor: "#00ABE0",
              "&:hover": {
                bgcolor: "#00ABE0",
              },
            }}
          >
            Browse  products
          </Button>
          </Link>
        </CardActions>
      </Card>
    )

}