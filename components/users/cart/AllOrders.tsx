'use client'

import { useState, useEffect } from 'react'
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Button,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Skeleton,
  Divider,
  Tooltip
} from '@mui/material'
import { 
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Place as PlaceIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

// Define types for our data structure
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
}

interface OrderItem {
  id: number;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  price: string | number;
  storeId: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
  address: string | Address;
  items: OrderItem[];
}

const statusColors = {
  PENDING: 'default',
  PROCESSING: 'primary',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error'
} as const;

interface OrdersTableProps {
  initialOrders: Order[];
  onStatusChange?: (orderId: string, itemId: number, newStatus: string) => Promise<void>;
}

export default function OrdersTable({ initialOrders, onStatusChange }: OrdersTableProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);

  useEffect(() => {
    setOrders(initialOrders);
    setLoading(false);
  }, [initialOrders]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, order: Order, item: OrderItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (newStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') => {
    if (selectedOrder && selectedItem && onStatusChange) {
      try {
        // Call the provided callback function to update status
        await onStatusChange(selectedOrder.id, selectedItem.id, newStatus);
        
        // Update local state
        setOrders(orders.map(order => {
          if (order.id === selectedOrder.id) {
            return {
              ...order,
              items: order.items.map(item => {
                if (item.id === selectedItem.id) {
                  return { ...item, orderStatus: newStatus };
                }
                return item;
              })
            };
          }
          return order;
        }));
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    }
    
    handleMenuClose();
  };

  // Format address based on whether it's a string or an object
  const formatAddress = (address: string | Address): string => {
    if (typeof address === 'string') {
      return address;
    }
    
    return address
      ? `${address.street}, ${address.city}, ${address.state} - ${address.postalCode}, ${address.phoneNumber}${address.alternatePhoneNumber ? `, ${address.alternatePhoneNumber}` : ''}`
      : "Unknown Address";
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof order.address === 'string' 
      ? order.address.toLowerCase().includes(searchTerm.toLowerCase())
      : Object.values(order.address).some(val => 
          val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
  );

  const displayedOrders = filteredOrders
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ 
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            All Orders ({orders.length})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Search orders..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
      
          <IconButton onClick={() => {
            setLoading(true);
            // Simulate refresh
            setTimeout(() => setLoading(false), 1000);
          }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '10%' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '10%' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '10%' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '30%' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '20%' }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '10%' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '10%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell><Skeleton variant="text" /></TableCell>
                </TableRow>
              ))
            ) : displayedOrders.length > 0 ? (
              displayedOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 'medium' }}>{order.id}</TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <PlaceIcon fontSize="small" sx={{ mt: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {formatAddress(order.address)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {order.items.map((item) => (
                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {item.quantity}x {item.productName}
                          </Typography>
                        
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {order.items.map((item) => (
                        <Chip 
                          key={item.id}
                          label={item.orderStatus} 
                          size="small" 
                          color={statusColors[item.orderStatus]}
                          sx={{ 
                            fontWeight: 'bold', 
                        
                            fontSize: '0.7rem'
                          }} 
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {order.items.map((item) => (
                        <IconButton 
                          key={item.id}
                          size="small" 
                          onClick={(e) => handleMenuOpen(e, order, item)}
                          sx={{ padding: 0.5 }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">No orders found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled sx={{ fontWeight: 'bold', color: 'black' }}>
          Change Status
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleStatusChange('PENDING')}>Pending</MenuItem>
        <MenuItem onClick={() => handleStatusChange('PROCESSING')}>Processing</MenuItem>
        <MenuItem onClick={() => handleStatusChange('SHIPPED')}>Shipped</MenuItem>
        <MenuItem onClick={() => handleStatusChange('DELIVERED')}>Delivered</MenuItem>
        <MenuItem onClick={() => handleStatusChange('CANCELLED')}>Cancelled</MenuItem>
      </Menu>
    </Paper>
  );
}
