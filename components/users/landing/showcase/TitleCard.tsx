"use client"

import { Box,  Typography } from "@mui/material";
import Image from "next/image";
import leftImage from "@/components/assets/users/cloth-img.png";
import rightImage from "@/components/assets/users/shoe-img.png";

import Link from "next/link";
import { BaseButton } from "../../buttons/BaseButton";

export default function TitleCard() {
  
  return (
    <Box sx={{ textAlign: "center", padding: 2, backgroundColor: "white" }}>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box sx={{ width: "100%", position: "relative", height: "auto" }}>
          <Image src={leftImage} alt="Left Image" layout="responsive" />
        </Box>
        <Box sx={{ width: "100%", position: "relative", height: "auto" }}>
          <Image src={rightImage} alt="Right Image" layout="responsive" />
        </Box>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          UNLEASH YOUR STYLE
        </Typography>
        <Typography variant="subtitle1" sx={{ marginTop: 1, color: "gray" }}>
          Top Clothing & Shoes from Every Store handpicked for you!
        </Typography>

        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
           <Link href="/stores" passHref>
            <BaseButton sx={{ borderRadius: 15 }}>
              Explore Stores
            </BaseButton>
          </Link>
          <Link  href="/products" passHref>
          <BaseButton sx={{borderRadius:15}}> Explore Products</BaseButton>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
