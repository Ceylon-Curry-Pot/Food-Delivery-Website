export type DeliveryZone = {
    id: string;
    name: string; // internal label, never shown to the customer
    fee: number; // fixed per zone
    areas: readonly string[];
};

export const deliveryZones: readonly DeliveryZone[] = [
    {
        id: "zone-1",
        name: "Central Colombo",
        fee: 200,
        areas: ['Fort', 'Slave Island', 'Kollupitiya', 'Colpetty', 'Bambalapitiya','Havelock Town', 'Cinnamon Gardens'],
    },
    {
    id: 'zone-2',
    name: 'Inner Colombo',
    fee: 300,
    areas: ['Wellawatte', 'Narahenpita', 'Borella', 'Thimbirigasyaya', 'Dematagoda',
            'Maradana', 'Pettah', 'Hultsdorf', 'Kotahena', 'Grandpass',
            'Mattakkuliya', 'Modara'],
    },
    {
        id: 'zone-3',
        name: 'Greater Colombo',
        fee: 400,
        areas: ['Dehiwala', 'Mount Lavinia', 'Kalubowila', 'Rajagiriya', 'Nawala',
                'Pita Kotte', 'Ethul Kotte', 'Battaramulla', 'Nugegoda', 'Kohuwala'],
    },
    {
        id: 'zone-4',
        name: 'Outer Metro',
        fee: 500,
        areas: ['Ratmalana', 'Pelawatta', 'Maharagama', 'Boralesgamuwa', 'Piliyandala'],
    },
];

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

// Build ONE lookup table at load time instead of scanning every zone on each call.
const areaIndex = new Map<string, { area: string; zone: DeliveryZone }>();
for (const zone of deliveryZones) {
    for (const area of zone.areas) {
        const key = normalize(area);
        if (areaIndex.has(key)) throw new Error(`Duplicate delivery area: ${area}`);
        areaIndex.set(key, { area, zone });
    }
}

/** Sorted list for the dropdown. */
export const deliveryAreas = [...areaIndex.values()]
    .map((v) => v.area)
    .sort((a, b) => a.localeCompare(b));

/** Returns the canonical area + its zone, or null if it isn't a real area. */
export function findDeliveryArea(input?: string | null) {
    if (!input) return null;
    return areaIndex.get(normalize(input)) ?? null;
}

export const getDeliveryFee = (area?: string | null) =>
    findDeliveryArea(area)?.zone.fee ?? null;

/** Used by every place that shows the fee. */
export function formatDeliveryFee(fee: number | null) {
    if (fee === null) return 'Set at checkout';
    return fee === 0 ? 'Free' : `Rs. ${fee.toLocaleString()}`;
}