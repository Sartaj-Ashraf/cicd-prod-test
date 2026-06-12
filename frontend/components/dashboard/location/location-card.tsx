type ScheduleItem = {
    _id?: string;
    day?: string;
    opening?: string;
    closing?:string;
};

type SelectedLocation = {
    _id?: string;
    placeId?: string;
    name?: string;
    nickname?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    lat?: number;
    lng?: number;
    rating?: number;
    totalReviews?: number;
    healthScore?: number;
    types?: string[];
    opening_hours?: {
        schedule?: ScheduleItem[];
    };
};

type LocationCardProps = {
    selectedLocation: SelectedLocation;
};

const LocationCard = ({ selectedLocation }: LocationCardProps) => {

    const fullAddress = [
        selectedLocation?.address,
        selectedLocation?.city,
        selectedLocation?.state,
        selectedLocation?.country,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div
            className="w-full overflow-hidden rounded-2xl transition-all duration-300 border select-none"
            style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
            }}
        >
            {/* ── Two-panel layout ── */}
            <div className="flex flex-col md:flex-row items-stretch">

                {/* ════ LEFT — all info ════ */}
                <div className="flex-1 p-8 flex flex-col gap-8">

                    {/* Name + nickname */}
                    <div>
                        <h2
                            className="font-bold leading-tight"
                            style={{
                                fontFamily: "var(--font-manrope)",
                                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                                color: "var(--heading)",
                            }}
                        >
                            {selectedLocation?.name || "Location Name"}
                        </h2>

                        {selectedLocation?.nickname && (
                            <p
                                style={{
                                    color: "var(--mango-orange)", // Switched to orange for better dark mode visibility
                                    fontFamily: "var(--font-geistMono)",
                                    fontSize: "0.85rem",
                                    marginTop: 4,
                                    fontWeight: 500
                                }}
                            >
                                @{selectedLocation.nickname}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    {fullAddress && (
                        <div className="space-y-1">
                            <p
                                style={{
                                    color: "var(--gray-medium)",
                                    fontSize: "0.65rem",
                                    fontFamily: "var(--font-geistMono)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                }}
                            >
                                Address
                            </p>
                            <p
                                style={{
                                    color: "var(--foreground)",
                                    fontSize: "0.95rem",
                                    fontFamily: "var(--font-geistMono)",
                                    lineHeight: 1.6,
                                }}
                            >
                                {fullAddress}
                            </p>
                        </div>
                    )}

                    {/* Rating + Reviews */}
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className="rounded-2xl px-5 py-4 transition-colors"
                            style={{
                                background: "var(--green-dim)",
                                border: "1px solid var(--leaf-main)",
                            }}
                        >
                            <p style={{ color: "var(--leaf-dark)", fontSize: "0.65rem", fontFamily: "var(--font-geistMono)", textTransform: "uppercase", fontWeight: 600 }}>
                                Rating
                            </p>
                            <p
                                style={{
                                    color: "var(--mango-mid)",
                                    fontWeight: 800,
                                    fontSize: "1.4rem",
                                    marginTop: 4,
                                    fontFamily: "var(--font-manrope)",
                                }}
                            >
                                ⭐ {selectedLocation?.rating ?? "N/A"}
                            </p>
                        </div>

                        <div
                            className="rounded-2xl px-5 py-4 transition-colors"
                            style={{
                                background: "var(--green-dim)",
                                border: "1px solid var(--leaf-main)",
                            }}
                        >
                            <p style={{ color: "var(--leaf-dark)", fontSize: "0.65rem", fontFamily: "var(--font-geistMono)", textTransform: "uppercase", fontWeight: 600 }}>
                                Reviews
                            </p>
                            <p
                                style={{
                                    color: "var(--leaf-main)",
                                    fontWeight: 800,
                                    fontSize: "1.4rem",
                                    marginTop: 4,
                                    fontFamily: "var(--font-manrope)",
                                }}
                            >
                                {selectedLocation?.totalReviews?.toLocaleString() ?? 0}
                            </p>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <p
                            style={{
                                color: "var(--gray-medium)",
                                fontSize: "0.65rem",
                                fontFamily: "var(--font-geistMono)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: 12,
                            }}
                        >
                            Categories
                        </p>
                        {selectedLocation?.types?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedLocation.types.map((type, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            background: "var(--secondary)",
                                            border: "1px solid var(--border)",
                                            color: "var(--foreground)",
                                            borderRadius: "8px",
                                            padding: "6px 12px",
                                            fontSize: "0.75rem",
                                            fontFamily: "var(--font-geistMono)",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "var(--gray-light)", fontSize: "0.8rem", fontFamily: "var(--font-geistMono)" }}>
                                No categories available
                            </p>
                        )}
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <p
                            style={{
                                color: "var(--gray-medium)",
                                fontSize: "0.65rem",
                                fontFamily: "var(--font-geistMono)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: 12,
                            }}
                        >
                            Opening Hours
                        </p>
                        {selectedLocation?.opening_hours?.schedule?.length ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 ">
                                {selectedLocation.opening_hours.schedule.map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className="flex flex-col gap-1 rounded-xl px-4 py-3 transition-colors"
                                        style={{
                                            background: "var(--secondary)",
                                            border: "1px solid var(--border)",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "var(--gray-medium)",
                                                fontSize: "0.7rem",
                                                fontFamily: "var(--font-geistMono)",
                                                fontWeight: 600,
                                                textTransform: "uppercase"
                                            }}
                                        >
                                            {item.day}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span
                                                style={{
                                                color: "var(--mango-orange)",
                                                fontSize: "0.85rem",
                                                fontFamily: "var(--font-geistMono)",
                                                fontWeight: 600,
                                                }}
                                            >
                                                {item.opening}
                                            </span>

                                            <span
                                                style={{
                                                color: "var(--text-secondary)",
                                                fontSize: "0.85rem",
                                                }}
                                            >
                                                —
                                            </span>

                                            <span
                                                style={{
                                                color: "var(--mango-orange)",
                                                fontSize: "0.85rem",
                                                fontFamily: "var(--font-geistMono)",
                                                fontWeight: 600,
                                                }}
                                            >
                                                {item.closing}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <p style={{ color: "var(--gray-light)", fontSize: "0.8rem", fontFamily: "var(--font-geistMono)" }}>
                                Schedule unavailable
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationCard;
