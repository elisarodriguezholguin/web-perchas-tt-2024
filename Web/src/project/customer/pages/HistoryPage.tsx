import React, { useEffect, useState } from "react";
import { BasePage } from "../../template";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Modal,
  Box,
  Typography,
  CircularProgress,
  Grid,
  FormControl,
} from "@mui/material";
import { BillApiHistory, DetailHistory } from "../../interface";
import { useBillStore } from "../../../shared";
import { useLazyGetBillHistoryQuery } from "../../../services";
import Swal from "sweetalert2";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "10px",
  maxHeight: "80vh",
  overflowY: "auto",
};

const filterContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "white",
  p: 2,
  borderRadius: "10px",
  m: 1,
  width: "100%",
  maxWidth: 800,
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "0 16px",
};

export const HistoryPage = () => {
  const [fetchGetBillHistory, { isLoading }] = useLazyGetBillHistoryQuery();
  const { billsHistory, onSetBillsHistory } = useBillStore();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillApiHistory | null>(null);
  const [filteredBillHistory, setFilteredBillHistory] = useState<
    BillApiHistory[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const onGetBillHistory = async () => {
    await fetchGetBillHistory()
      .unwrap()
      .then((resp) => {
        onSetBillsHistory(resp);
        setFilteredBillHistory(resp);
      })
      .catch((e) => {
        Swal.fire("Error", `${JSON.stringify(e.data, null, 3)}`, "error");
      });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpen = (bill: BillApiHistory) => {
    setSelectedBill(bill);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReset = () => {
    setFilteredBillHistory(billsHistory);
    setSelectedDate(null);
  };

  const filterBills = (date: dayjs.Dayjs | null) => {
    const filtered = billsHistory.filter((x) =>
      date ? dayjs(x.fechaCotizacion).isSame(date, "day") : true
    );
    setFilteredBillHistory(filtered);
  };

  useEffect(() => {
    onGetBillHistory();
  }, []);

  useEffect(() => {
    filterBills(selectedDate);
  }, [selectedDate, billsHistory]);

  return (
    <BasePage>
      {/* <Typography variant="h4" gutterBottom>
        Historial de Compras
      </Typography> */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      ) : (
        <>
          <Box sx={filterContainerStyle}>
            <Typography variant="h6" component="div" gutterBottom>
              Filtros
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <FormControl fullWidth sx={{ maxWidth: 400, mb: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    format="DD/MM/YYYY"
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Box>

            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={handleReset}
            >
              Reiniciar Filtro
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ width: "99%", mt: 2 }}
            className="box-shadow animate__animated animate__fadeIn"
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Área Comercial</TableCell>
                  <TableCell>Área Total</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>IVA</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBillHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.idCotizacion}>
                      <TableCell>{row.nameAreaComercial}</TableCell>
                      <TableCell>{row.areaTotal}</TableCell>
                      <TableCell>{`$ ${row.subtotal.toFixed(2)}`}</TableCell>
                      <TableCell>{`$ ${row.iva.toFixed(2)}`}</TableCell>
                      <TableCell>{`$ ${row.total.toFixed(2)}`}</TableCell>
                      <TableCell>
                        {" "}
                        {dayjs(row.fechaCotizacion).format("DD/MM/YYYY HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpen(row)}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={billsHistory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Detalles de la Compra
          </Typography>
          {selectedBill && (
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  Área Comercial: {selectedBill.nameAreaComercial}
                </Typography>
                <Typography>Área Total: {selectedBill.areaTotal}</Typography>
                <Typography>
                  Subtotal: ${selectedBill.subtotal.toFixed(2)}
                </Typography>
                <Typography>IVA: ${selectedBill.iva.toFixed(2)}</Typography>
                <Typography>Total: ${selectedBill.total.toFixed(2)}</Typography>
                <Typography sx={{ mt: 2 }}>
                  <strong>Detalles:</strong>
                </Typography>
                <Box sx={{ maxHeight: "50vh", overflowY: "auto", mt: 1 }}>
                  {selectedBill.detalles.map((detail: DetailHistory) => (
                    <Box key={detail.idDetalleCotizacion} sx={{ pl: 2, mb: 1 }}>
                      <Typography>
                        Producto: {detail.tipoPercha.nombre}
                      </Typography>
                      <Typography>Metros: {detail.metros}</Typography>
                      <Typography>Divisiones: {detail.divisiones}</Typography>
                      <Typography>
                        Precio unitario (por metro y división): $
                        {(
                          (detail.texturaPercha.precio ?? 0) *
                          (detail.tipoPercha.factorPrecio ?? 0)
                        ).toFixed(2)}
                      </Typography>
                      <Typography>
                        Precio Total ( $
                        {(
                          (detail.texturaPercha.precio ?? 0) *
                          (detail.tipoPercha.factorPrecio ?? 0)
                        ).toFixed(2)}{" "}
                        x {detail.metros}m x {detail.divisiones}d): $
                        {(
                          (detail.texturaPercha.precio ?? 0) *
                          (detail.tipoPercha.factorPrecio ?? 0) *
                          detail.divisiones *
                          detail.metros
                        ).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  component="img"
                  src={`${selectedBill.imageBase64}`}
                  alt="Imagen"
                  sx={{
                    width: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </BasePage>
  );
};
