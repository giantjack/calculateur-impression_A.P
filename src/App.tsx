import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";

// Base de données des appareils photo courants
const CAMERAS: Record<string, { megapixels: number; brand: string }> = {
  // Canon
  "Canon EOS R5": { megapixels: 45, brand: "Canon" },
  "Canon EOS R6 II": { megapixels: 24.2, brand: "Canon" },
  "Canon EOS R8": { megapixels: 24.2, brand: "Canon" },
  "Canon EOS R7": { megapixels: 32.5, brand: "Canon" },
  "Canon EOS 5D Mark IV": { megapixels: 30.4, brand: "Canon" },
  // Sony
  "Sony A7R V": { megapixels: 61, brand: "Sony" },
  "Sony A7 IV": { megapixels: 33, brand: "Sony" },
  "Sony A7C II": { megapixels: 33, brand: "Sony" },
  "Sony A6700": { megapixels: 26, brand: "Sony" },
  // Nikon
  "Nikon Z8": { megapixels: 45.7, brand: "Nikon" },
  "Nikon Z6 III": { megapixels: 24.5, brand: "Nikon" },
  "Nikon Z5": { megapixels: 24.3, brand: "Nikon" },
  "Nikon D850": { megapixels: 45.7, brand: "Nikon" },
  // Fujifilm
  "Fujifilm X-T5": { megapixels: 40.2, brand: "Fujifilm" },
  "Fujifilm X-H2": { megapixels: 40.2, brand: "Fujifilm" },
  "Fujifilm GFX 100S": { megapixels: 102, brand: "Fujifilm" },
  // Smartphones
  "iPhone 15 Pro Max": { megapixels: 48, brand: "Apple" },
  "iPhone 15 Pro": { megapixels: 48, brand: "Apple" },
  "iPhone 15": { megapixels: 48, brand: "Apple" },
  "iPhone 14 Pro": { megapixels: 48, brand: "Apple" },
  "Samsung Galaxy S24 Ultra": { megapixels: 200, brand: "Samsung" },
  "Samsung Galaxy S24": { megapixels: 50, brand: "Samsung" },
  "Google Pixel 8 Pro": { megapixels: 50, brand: "Google" },
};

// Qualités d'impression avec leurs DPI recommandés
const PRINT_QUALITIES = [
  {
    name: "Excellente",
    dpi: 300,
    description: "Qualité pro, observation de près",
    color: "green",
  },
  {
    name: "Très bonne",
    dpi: 240,
    description: "Livres photo, tirages standard",
    color: "teal",
  },
  {
    name: "Bonne",
    dpi: 150,
    description: "Posters, observation à distance moyenne",
    color: "blue",
  },
  {
    name: "Acceptable",
    dpi: 100,
    description: "Grands formats, observation de loin",
    color: "orange",
  },
];

// Formats d'impression courants (en cm)
const COMMON_FORMATS = [
  { name: "10x15", width: 10, height: 15 },
  { name: "13x18", width: 13, height: 18 },
  { name: "20x30", width: 20, height: 30 },
  { name: "30x40", width: 30, height: 40 },
  { name: "40x60", width: 40, height: 60 },
  { name: "50x70", width: 50, height: 70 },
  { name: "60x90", width: 60, height: 90 },
  { name: "70x100", width: 70, height: 100 },
];

function App() {
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [customMegapixels, setCustomMegapixels] = useState<number>(24);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Mégapixels effectifs (appareil sélectionné ou valeur custom)
  const megapixels = selectedCamera
    ? CAMERAS[selectedCamera].megapixels
    : customMegapixels;

  // Calcul des dimensions en pixels (ratio 3:2 standard)
  const dimensions = useMemo(() => {
    const totalPixels = megapixels * 1000000;
    // Ratio 3:2 : width = sqrt(totalPixels * 3/2), height = sqrt(totalPixels * 2/3)
    const width = Math.round(Math.sqrt(totalPixels * 1.5));
    const height = Math.round(Math.sqrt(totalPixels / 1.5));
    return { width, height };
  }, [megapixels]);

  // Calcul de la taille max d'impression pour chaque qualité
  const printSizes = useMemo(() => {
    return PRINT_QUALITIES.map((quality) => {
      // Conversion pixels -> cm à ce DPI
      // 1 inch = 2.54 cm, donc cm = (pixels / dpi) * 2.54
      const widthCm = (dimensions.width / quality.dpi) * 2.54;
      const heightCm = (dimensions.height / quality.dpi) * 2.54;
      return {
        ...quality,
        widthCm: Math.round(widthCm * 10) / 10,
        heightCm: Math.round(heightCm * 10) / 10,
      };
    });
  }, [dimensions]);

  // Vérifier si un format est possible pour chaque qualité
  const formatCompatibility = useMemo(() => {
    return COMMON_FORMATS.map((format) => {
      const results = PRINT_QUALITIES.map((quality) => {
        const maxWidthCm = (dimensions.width / quality.dpi) * 2.54;
        const maxHeightCm = (dimensions.height / quality.dpi) * 2.54;
        // On vérifie si le format rentre (en paysage ou portrait)
        const fitsLandscape =
          format.width <= maxWidthCm && format.height <= maxHeightCm;
        const fitsPortrait =
          format.height <= maxWidthCm && format.width <= maxHeightCm;
        return fitsLandscape || fitsPortrait;
      });
      return { format, results };
    });
  }, [dimensions]);

  // Marques du slider
  const sliderMarks = isMobile
    ? [12, 24, 50, 100, 200]
    : [12, 24, 36, 50, 61, 100, 150, 200];

  return (
    <Box maxW="900px" mx="auto" p={{ base: 3, md: 6 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {/* Sélection appareil ou mégapixels */}
        <Box>
          <Text fontWeight="medium" fontSize="sm" mb={2}>
            Choisir un appareil
          </Text>
          <Select
            placeholder="-- Sélectionner un appareil --"
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            borderColor="#212E40"
            _hover={{ borderColor: "#FB9936" }}
            _focus={{ borderColor: "#FB9936", boxShadow: "0 0 0 1px #FB9936" }}
          >
            {Object.entries(CAMERAS)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([name, data]) => (
                <option key={name} value={name}>
                  {name} ({data.megapixels} MP)
                </option>
              ))}
          </Select>
        </Box>

        <HStack>
          <Divider />
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            ou
          </Text>
          <Divider />
        </HStack>

        {/* Slider mégapixels custom */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="medium" fontSize="sm">
              Entrer les mégapixels manuellement
            </Text>
            <Badge colorScheme="orange" fontSize="md" px={2}>
              {megapixels} MP
            </Badge>
          </Flex>
          <Box px={2} pb={6}>
            <Slider
              aria-label="megapixels"
              value={customMegapixels}
              onChange={(val) => {
                setCustomMegapixels(val);
                setSelectedCamera(""); // Reset camera selection
              }}
              min={1}
              max={200}
              step={1}
            >
              {sliderMarks.map((mark) => (
                <SliderMark
                  key={mark}
                  value={mark}
                  mt={2}
                  ml={-2}
                  fontSize="xs"
                >
                  {mark}
                </SliderMark>
              ))}
              <SliderTrack bg="#EFF7FB">
                <SliderFilledTrack bg="#FB9936" />
              </SliderTrack>
              <SliderThumb borderColor="#212E40" boxSize={5} />
            </Slider>
          </Box>
        </Box>

        {/* Résolution de l'image */}
        <Box bg="#EFF7FB" p={4} borderRadius="md">
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
            <Text fontWeight="medium" color="#212E40">
              Résolution de l'image
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="#212E40">
              {dimensions.width.toLocaleString()} x {dimensions.height.toLocaleString()} px
            </Text>
          </Flex>
        </Box>

        {/* Tailles maximales par qualité */}
        <Box>
          <Text fontWeight="medium" fontSize="sm" mb={3}>
            Tailles maximales d'impression
          </Text>
          <VStack spacing={3} align="stretch">
            {printSizes.map((size) => (
              <Box
                key={size.dpi}
                p={3}
                borderWidth={1}
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
              >
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
                  <Box>
                    <HStack>
                      <Badge colorScheme={size.color}>{size.name}</Badge>
                      <Text fontSize="sm" color="gray.500">
                        {size.dpi} DPI
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.400">
                      {size.description}
                    </Text>
                  </Box>
                  <Text fontSize="xl" fontWeight="bold" color="#212E40">
                    {size.widthCm} x {size.heightCm} cm
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Tableau des formats courants */}
        <Box>
          <Text fontWeight="medium" fontSize="sm" mb={3}>
            Compatibilité avec les formats courants
          </Text>
          <TableContainer>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Format</Th>
                  {PRINT_QUALITIES.map((q) => (
                    <Th key={q.dpi} textAlign="center" fontSize="xs">
                      {isMobile ? q.dpi : `${q.name} (${q.dpi})`}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {formatCompatibility.map(({ format, results }) => (
                  <Tr key={format.name}>
                    <Td fontWeight="medium">{format.name} cm</Td>
                    {results.map((ok, i) => (
                      <Td key={i} textAlign="center">
                        {ok ? (
                          <Text color="green.500" fontWeight="bold">
                            OK
                          </Text>
                        ) : (
                          <Text color="red.400">Non</Text>
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Info pédagogique */}
        <Box bg="gray.50" p={4} borderRadius="md" fontSize="sm" color="gray.600">
          <Text fontWeight="medium" mb={2}>
            Comprendre les DPI
          </Text>
          <Text>
            <strong>DPI</strong> (dots per inch) = nombre de points par pouce. Plus le DPI est élevé,
            plus l'image sera nette de près. Pour un tirage photo standard vu à bout de bras,
            240-300 DPI est idéal. Pour un poster vu de loin, 100-150 DPI suffit.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default App;
