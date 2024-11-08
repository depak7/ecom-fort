import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import bannerimg from '@/components/assets/users/bannerimg.png'
import Box from "next-auth/providers/box";

export default function(){


    return( 
        <Grid container sx={{bgcolor:"#E2E2E2"}}>
            <Grid item xs={12} md={6} sx={{ 
          bgcolor: '#e0e4d4', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          p: 4 
        }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
            Look Amazing,
          </Typography>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
            Feel Unstoppable!
          </Typography>
          <Typography variant="subtitle1" >
            Revamp your wardrobe with the freshest looks!
          </Typography>
          <Typography variant="subtitle1">
            Unleash your inner trendsetter with outfits that make every day runway-worthy!
          </Typography>
        </Grid>
        <Grid item xs={0} md={6} sx={{ position: 'relative', height: { xs: '300px', md: '800px' } }}>
          <Image
            src={bannerimg}
            alt="Stylish man in trendy outfit"
            width={700}
            height={800}
            priority
          />
               </Grid>
        </Grid>
    )
}