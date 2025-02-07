import { NetworkSummary } from "@/types/ndex";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ClientDate from "./ClientDate";
import DOMPurify from "dompurify";

const DRAWER_WIDTH = 400;

interface NetworkDetailsProps {
  network?: NetworkSummary;
  open: boolean;
  onClose: () => void;
}

export default function NetworkDetails({ network, open, onClose }: NetworkDetailsProps) {
  return (
    <>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            overflowX: "visible", // Allow content to overflow for the toggle button
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        {network && (
          <>
            <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="h6">Network Details</Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" noWrap gutterBottom>
                {network.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                paragraph
                component="div"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(network.description || "No description")
                }}
              />
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Owner"
                    secondary={network.owner}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Created"
                    secondary={<ClientDate date={network.created} />}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Modified"
                    secondary={<ClientDate date={network.modified} />}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Version"
                    secondary={network.version}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Network Size"
                    secondary={`${network.nodeCount} nodes, ${network.edgeCount} edges`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Visibility"
                    secondary={network.visibility}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="UUID"
                    secondary={network.externalId}
                  />
                </ListItem>
              </List>
              {network.properties.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Properties
                  </Typography>
                  <List dense>
                    {network.properties.map((prop, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={prop.predicateString}
                          secondary={prop.value}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>
          </>
        )}
      </Drawer>
      {network && (
        <>
          <IconButton 
            onClick={onClose}
            sx={{
              position: 'fixed',
              right: open ? DRAWER_WIDTH : 0,
              top: 72,
              width: 28,
              height: 48,
              borderRadius: '8px 0 0 8px',
              backgroundColor: 'background.paper',
              boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              zIndex: theme => theme.zIndex.drawer + 2,
              transition: theme => theme.transitions.create(['right']),
            }}
          >
            {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </>
      )}
    </>
  );
}
