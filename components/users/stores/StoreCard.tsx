import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { LocationOn as LocationIcon } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

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
        border: "1px solid #ccc",
        boxShadow: "none",
        maxWidth: isMobile ? "95%" : isTablet ? "300px" : "350px",
        margin: "auto",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <CardMedia
        sx={{
          width: "100%", 
          height: isMobile ? 100 : isTablet ? 120 : 150,
          position: "relative",
          borderBottom: "1px solid #eee",
        }}
      >
        <Image
          src={store.logo || "/placeholder.svg?height=200&width=350"}
          alt={store.name}
          layout="fill"
          objectFit="cover"
        />
      </CardMedia>

      <CardContent sx={{ flexGrow: 1, padding: isMobile ? 1: 2 }}>
        <Typography
          gutterBottom
          variant={isMobile ? "subtitle1" : "h6"}
          component="div"
          noWrap
        >
          {store.name}
        </Typography>
        {store.city && (
          <Chip
            icon={<LocationIcon sx={{ fontSize: 14 }} />}
            label={store.city}
            size="small"
            variant="outlined"
            sx={{ mb: 1, maxWidth: "100%" }}
          />
        )}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
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
          padding: isMobile ? 2 : 3,
        }}
      >
        <Link href={`/stores/${store.id}/${encodeURIComponent(store.name)}`} passHref>
          <Button
            size={isMobile ? "small" : "medium"}
            variant="contained"
            sx={{
              bgcolor: "#374151",
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
