CREATE TABLE `pipeline` (
	`id` int AUTO_INCREMENT NOT NULL,
	`address` varchar(255) NOT NULL,
	`hamlet` varchar(64) NOT NULL,
	`type` varchar(64) NOT NULL DEFAULT 'Listing',
	`status` varchar(64) NOT NULL DEFAULT 'Prospect',
	`askPrice` varchar(32) DEFAULT '',
	`dom` int DEFAULT 0,
	`notes` text DEFAULT (''),
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pipeline_id` PRIMARY KEY(`id`)
);
