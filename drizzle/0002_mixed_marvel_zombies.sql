CREATE TABLE `listings` (
`id` int AUTO_INCREMENT NOT NULL,
`address` varchar(255) NOT NULL,
`price` varchar(64) NOT NULL DEFAULT '',
`hamlet` varchar(64) NOT NULL DEFAULT 'East Hampton North',
`url` text NOT NULL,
`imageUrl` text,
`beds` varchar(16),
`baths` varchar(16),
`sqft` varchar(32),
`status` varchar(32) NOT NULL DEFAULT 'Active',
`syncedAt` timestamp NOT NULL DEFAULT (now()),
`createdAt` timestamp NOT NULL DEFAULT (now()),
`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT `listings_id` PRIMARY KEY(`id`)
);
