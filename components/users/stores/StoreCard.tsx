import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import StoreCityLabel from "./StoreCityLabel";

interface IProps {
  store: {
    id: string;
    name: string;
    logo: string | null;
    city: string;
    address: string;
    description: string;
  };
}

export default function StoreCard({ store }: IProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #e5e7eb",
        boxShadow: "none",
        maxWidth: isMobile ? "95%" : isTablet ? "300px" : "350px",
        margin: "auto",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#fff",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: "#d1d5db",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        },
      }}
    >
      <CardMedia
        sx={{
          width: "100%",
          height: isMobile ? 100 : isTablet ? 120 : 150,
          position: "relative",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <Image
          src={store.logo || "/placeholder.svg?height=200&width=350"}
          alt={store.name}
          layout="fill"
          objectFit="cover"
        />
      </CardMedia>

      <CardContent sx={{ flexGrow: 1, px: 2, pt: 2, pb: 1.5 }}>
        <Typography
          gutterBottom
          variant={isMobile ? "subtitle1" : "h6"}
          component="div"
          noWrap
          sx={{ color: "#111827", fontWeight: 700, mb: 0.75 }}
        >
          {store.name}
        </Typography>
        {store.city && (
          <Box sx={{ mb: 1.25 }}>
            <StoreCityLabel city={store.city} />
          </Box>
        )}
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {store.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "flex-end",
          px: 2,
          pb: 2,
          pt: 0,
        }}
      >
        <Link href={`/stores/${store.id}/${encodeURIComponent(store.name)}`} passHref>
          <Button
            size={isMobile ? "small" : "medium"}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: "#374151",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1.5,
              "&:hover": {
                bgcolor: "#1f2937",
              },
              width: isMobile ? "100%" : "auto",
            }}
          >
            Browse products
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
