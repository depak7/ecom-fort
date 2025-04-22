import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AppBar, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import SortProducts from "@/components/users/products/SortProducts";

export default function StoreNavbar({ onSortChange }: { onSortChange: (sort: string) => void }) {
  const params = useParams();
  const [storeName, setStoreName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const decodedStoreName = (params.store_name as string)?.replace(/%20/g, " ") || "";
    setStoreName(decodedStoreName);
    setLoading(false);
  }, [params.store_name]);

  const handleSortSelect = (sort: string) => {
    onSortChange(sort); 
  };

  if (loading || !storeName) return null;

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ color: "black" }} fontWeight={700}>
          {storeName}
        </Typography>
        <SortProducts onSortChange={handleSortSelect} />
      </Toolbar>
    </AppBar>
  );
}
