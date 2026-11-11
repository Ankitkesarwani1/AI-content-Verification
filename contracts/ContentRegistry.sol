// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ContentRegistry
 * @dev Cryptographic provenance and authenticity registry for AI-generated and digital content.
 * Stores SHA-256 fingerprints, registrar addresses, timestamps, and descriptive labels on-chain.
 */
contract ContentRegistry {

    struct ContentRecord {
        address registrar;
        uint256 timestamp;
        string label;
        bool exists;
    }

    // Mapping from content hash to its metadata record
    mapping(bytes32 => ContentRecord) private records;

    // Array of all registered hashes for on-chain enumeration
    bytes32[] private registeredHashes;

    // Total count of registered content records
    uint256 public totalRegistrations;

    // Event emitted whenever new content fingerprint is registered
    event ContentRegistered(
        bytes32 indexed contentHash,
        address indexed registrar,
        uint256 timestamp,
        string label
    );

    /**
     * @dev Register a content fingerprint with a descriptive label.
     * @param contentHash The 32-byte SHA-256 hash of the content.
     * @param label Descriptive title or metadata label for the content.
     */
    function registerContent(
        bytes32 contentHash,
        string calldata label
    ) external {
        require(
            contentHash != bytes32(0),
            "Invalid content hash: zero hash not permitted"
        );

        require(
            !records[contentHash].exists,
            "Content already registered: duplicate registration rejected"
        );

        records[contentHash] = ContentRecord({
            registrar: msg.sender,
            timestamp: block.timestamp,
            label: label,
            exists: true
        });

        registeredHashes.push(contentHash);
        totalRegistrations++;

        emit ContentRegistered(
            contentHash,
            msg.sender,
            block.timestamp,
            label
        );
    }

    /**
     * @dev Verify if a content hash exists and retrieve its provenance details.
     * @param contentHash The SHA-256 hash to query.
     * @return exists True if registered on-chain, false otherwise.
     * @return registrar Address of the wallet that registered the fingerprint.
     * @return timestamp Block timestamp when the fingerprint was recorded.
     * @return label The descriptive label entered at registration time.
     */
    function verifyContent(
        bytes32 contentHash
    )
        external
        view
        returns (
            bool exists,
            address registrar,
            uint256 timestamp,
            string memory label
        )
    {
        ContentRecord memory record = records[contentHash];

        return (
            record.exists,
            record.registrar,
            record.timestamp,
            record.label
        );
    }

    /**
     * @dev Returns the total number of registered records.
     */
    function getRegistrationCount() external view returns (uint256) {
        return totalRegistrations;
    }

    /**
     * @dev Returns all registered content hashes for dashboard and audit listing.
     */
    function getAllRegisteredHashes() external view returns (bytes32[] memory) {
        return registeredHashes;
    }

    /**
     * @dev Retrieve a registered hash by its sequential index.
     * @param index The 0-based index in the registry.
     */
    function getHashByIndex(uint256 index) external view returns (bytes32) {
        require(index < registeredHashes.length, "Index out of bounds");
        return registeredHashes[index];
    }
}
