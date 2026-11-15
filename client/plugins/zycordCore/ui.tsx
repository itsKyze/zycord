/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import type { ReactNode } from "react";
import { Button as NativeButton, Text, TextInput } from "@webpack/common";

export function SettingsSection({ title, description, className, children }: { title: string; description?: string; className?: string; children: ReactNode }) {
    return (
        <section className={className} aria-label={title}>
            <div className="zycord-ui-section-heading">
                <h3>{title}</h3>
                {description && (
                    <Text variant="text-sm/normal" color="text-muted">
                        {description}
                    </Text>
                )}
            </div>
            {children}
        </section>
    );
}

export function Field({
    id,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    className,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "text" | "search";
    className?: string;
}) {
    return (
        <div className={className}>
            <label htmlFor={id}>
                {Text ? <Text variant="text-sm/medium">{label}</Text> : <span>{label}</span>}
            </label>
            {TextInput ? (
                <TextInput id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} />
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e: any) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 4,
                        background: "var(--input-background, #1e1f22)",
                        color: "var(--text-normal, #dbdee1)",
                        border: "none",
                    }}
                />
            )}
        </div>
    );
}

export function Button({ variant = "primary", disabled, onClick, children }: { variant?: "primary" | "secondary"; disabled?: boolean; onClick: () => void; children: ReactNode }) {
    if (NativeButton && typeof NativeButton === "function") {
        return (
            <NativeButton
                type="button"
                color={variant === "secondary" ? NativeButton.Colors?.PRIMARY || "PRIMARY" : NativeButton.Colors?.BRAND || "BRAND"}
                size={NativeButton.Sizes?.SMALL || "small"}
                disabled={disabled}
                onClick={onClick}
            >
                {children}
            </NativeButton>
        );
    }
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            style={{
                padding: "8px 16px",
                borderRadius: 4,
                cursor: disabled ? "not-allowed" : "pointer",
                background: variant === "secondary" ? "var(--button-secondary-background, #4e5058)" : "var(--brand-experiment, #5865f2)",
                color: "#fff",
                border: "none",
                fontWeight: 500,
            }}
        >
            {children}
        </button>
    );
}
