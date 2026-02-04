#[allow(unused_const, unused_field)]
module vote::vote;

use std::option::Option;
use std::string::String;
use sui::address;
use sui::clock::{Self, Clock};
use sui::event;
use sui::object;
use sui::vec_map::{Self, VecMap};

const EAlreadyRegistered: u64 = 1;
const EVoterNotFound: u64 = 2;
const EElectionEnded: u64 = 3;
const EInvalidTime: u64 = 4;
const EElectionAlreadyStarted: u64 = 5;
const ECandidateNotFound: u64 = 6;
const EVoterNotRegistered: u64 = 7;
const EAlreadyVoted: u64 = 8;
const EElectionNotActive: u64 = 9;
const EAdminCapMismatch: u64 = 10;
const EElectionNotEnded: u64 = 11;

//Election object
public struct Election has key {
    id: UID,
    name: String,
    description: String,
    start_time: u64,
    end_time: u64,
    is_active: bool,
    is_ended: bool,
    candidate_addresses: vector<address>,
    candidate_info: VecMap<address, Candidateinfo>,
    vote_counts: VecMap<address, u64>,
    voters: VecMap<address, bool>,
    total_votes: u64,
    winner: Option<address>,
    // candidate_id -> candidate_address
}

//candidate object
public struct Candidateinfo has copy, drop, store { name: String, description: String, pfp: String }
//voter object
public struct Voter has key, store {
    id: UID,
    voter_address: address,
    election_id: u64,
    has_voted: bool,
    voted_for: u64, // candidate_id
}

//vote object
public struct Vote has key, store {
    id: UID,
    candidate_id: u64,
    election_id: u64,
    voter_address: address,
    timestamp: u64,
}

//election result object
public struct ElectionResult has key, store {
    id: UID,
    election_id: u64,
    election_name: String,
    election_description: String,
    winner_address: address,
    winner_name: u64, // candidate_id
    winner_description: String,
    winner_votes: u64,
    winner_pfp: String,
    total_votes: u64,
    end_time: u64,
    all_results: VecMap<address, u64>,
    // candidate_id -> vote_count
}

//election admin object
public struct ElectionAdminCap has key, store {
    id: UID,
    election_id: ID,
}

//initialize  function

//vote passobject
public struct VotePass has key, store {
    id: UID,
    name: String,
    voter_address: address,
    election_id: u64,
    has_voted: bool,
    voted_for: u64, // candidate_id
}

//candidate pass object
public struct CandidatePass has key, store {
    id: UID,
    name: String,
    candidate_address: address,
    election_id: u64,
    description: String,
    used: bool,
    pfp: String,
}

// -------------------- Events --------------------
public struct EventElectionCreated has copy, drop, store {
    election_id: u64,
    name: String,
    creator: address,
}

public struct EventVoterRegistered has copy, drop, store {
    election_id: u64,
    voter: address,
}

public struct EventCandidateRegistered has copy, drop, store {
    election_id: u64,
    candidate: address,
}

public struct EventVoteCast has copy, drop, store {
    election_id: u64,
    voter: address,
    candidate: address,
}

public struct EventElectionEnded has copy, drop, store {
    election_id: u64,
    winner: Option<address>,
    total_votes: u64,
}

// Register a new voter for an election
public entry fun register_voter(
    _admin_cap: &ElectionAdminCap,
    election: &mut Election,
    voter_address: address,
    name: String,
    ctx: &mut TxContext,
) {
    assert!(!election.voters.contains(&voter_address), EAlreadyRegistered);
    election.voters.insert(voter_address, false);

    let election_id_obj = object::id(election);
    let election_addr = object::id_to_address(&election_id_obj);
    let election_id_u64 = (address::to_u256(election_addr) as u64);

    let vote_pass = VotePass {
        id: object::new(ctx),
        name,
        voter_address,
        has_voted: false,
        voted_for: 0, // 0 indicates no vote cast yet
        election_id: election_id_u64,
    };

    transfer::transfer(vote_pass, voter_address);
    event::emit(EventVoterRegistered { election_id: election_id_u64, voter: voter_address });
}

// Remove a voter from an election
public entry fun deregister_voter(
    _admin_cap: &ElectionAdminCap,
    election: &mut Election,
    voter_address: address,
) {
    assert!(election.voters.contains(&voter_address), EVoterNotFound);

    election.voters.remove(&voter_address);
}

// Get voter status
public fun get_voter_status(election: &Election, voter_address: address): bool {
    if (vec_map::contains(&election.voters, &voter_address)) {
        *vec_map::get(&election.voters, &voter_address)
    } else {
        false
    }
}

// Get current results
public fun get_results(election: &Election): (vector<address>, vector<u64>, u64) {
    let addresses = election.candidate_addresses;
    let mut votes = vector::empty<u64>();

    let len = addresses.length();
    let mut i = 0;
    while (i < len) {
        let addr = *addresses.borrow(i);
        let vote_count = *vec_map::get(&election.vote_counts, &addr);
        votes.push_back(vote_count);
        i = i + 1;
    };

    (addresses, votes, election.total_votes)
}

// Get winner
public fun get_winner(election: &Election): option::Option<address> {
    election.winner
}

// Get all candidates
public fun get_all_candidates(election: &Election): vector<address> {
    election.candidate_addresses
}

// Check if voter is registered
public fun is_voter_registered(election: &Election, voter_address: address): bool {
    vec_map::contains(&election.voters, &voter_address)
}

// ==================== ADDITIONAL FUNCTIONS ====================

// Extend election time
public entry fun extend_election_time(
    election: &mut Election,
    _admin_cap: &ElectionAdminCap,
    new_end_time: u64,
    _ctx: &mut TxContext,
) {
    assert!(!election.is_ended, EElectionEnded);
    assert!(new_end_time > election.end_time, EInvalidTime);

    election.end_time = new_end_time;
}

// Remove candidate (before election starts)
public entry fun remove_candidate(
    election: &mut Election,
    _admin_cap: &ElectionAdminCap,
    candidate_address: address,
    _ctx: &mut TxContext,
) {
    assert!(!election.is_active, EElectionAlreadyStarted);
    assert!(vec_map::contains(&election.candidate_info, &candidate_address), ECandidateNotFound);

    vec_map::remove(&mut election.candidate_info, &candidate_address);
    vec_map::remove(&mut election.vote_counts, &candidate_address);

    // Remove from candidate_addresses vector
    let (found, index) = election.candidate_addresses.index_of(&candidate_address);
    if (found) {
        election.candidate_addresses.remove(index);
    };
}

// Register a new candidate for an election
public entry fun register_candidate(
    admin_cap: &ElectionAdminCap,
    election: &mut Election,
    candidate_address: address,
    name: String,
    description: String,
    pfp: String,
    ctx: &mut TxContext,
) {
    assert!(admin_cap.election_id == object::id(election), EAdminCapMismatch);
    assert!(!vec_map::contains(&election.candidate_info, &candidate_address), EAlreadyRegistered);

    let info = Candidateinfo { name: name, description: description, pfp: pfp };
    election.candidate_info.insert(candidate_address, info);
    election.candidate_addresses.push_back(candidate_address);
    election.vote_counts.insert(candidate_address, 0u64);

    let election_id_obj = object::id(election);
    let election_addr = object::id_to_address(&election_id_obj);
    let election_id_u64 = (address::to_u256(election_addr) as u64);

    // Create and transfer CandidatePass to the candidate
    let candidate_pass = CandidatePass {
        id: object::new(ctx),
        name: name,
        candidate_address,
        election_id: election_id_u64,
        description: description,
        used: false,
        pfp: pfp,
    };
    transfer::transfer(candidate_pass, candidate_address);

    event::emit(EventCandidateRegistered {
        election_id: election_id_u64,
        candidate: candidate_address,
    });
}

// Cast a vote for a candidate
public entry fun cast_vote(
    election: &mut Election,
    vote_pass: &mut VotePass,
    candidate_address: address,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let voter_address = tx_context::sender(ctx);

    // Validate election is active
    assert!(election.is_active, EElectionNotActive);
    assert!(!election.is_ended, EElectionEnded);

    // Validate time is within election period
    let current_time = clock::timestamp_ms(clock);
    assert!(current_time >= election.start_time, EElectionNotActive);
    assert!(current_time <= election.end_time, EElectionEnded);

    // Validate VotePass belongs to this election
    let election_id_obj = object::id(election);
    let election_addr = object::id_to_address(&election_id_obj);
    let election_id_u64 = (address::to_u256(election_addr) as u64);
    assert!(vote_pass.election_id == election_id_u64, EAdminCapMismatch);

    // Validate voter owns this VotePass
    assert!(vote_pass.voter_address == voter_address, EVoterNotRegistered);

    // Validate voter hasn't voted yet
    assert!(!vote_pass.has_voted, EAlreadyVoted);

    // Validate voter is registered in election
    assert!(vec_map::contains(&election.voters, &voter_address), EVoterNotRegistered);
    let has_voted_in_election = *vec_map::get(&election.voters, &voter_address);
    assert!(!has_voted_in_election, EAlreadyVoted);

    // Validate candidate exists
    assert!(vec_map::contains(&election.candidate_info, &candidate_address), ECandidateNotFound);

    // Update VotePass
    vote_pass.has_voted = true;
    vote_pass.voted_for = (address::to_u256(candidate_address) as u64);

    // Mark voter as voted in election (remove old entry and insert new)
    vec_map::remove(&mut election.voters, &voter_address);
    vec_map::insert(&mut election.voters, voter_address, true);

    // Increment candidate vote count (remove old and insert new)
    let current = *vec_map::get(&election.vote_counts, &candidate_address);
    vec_map::remove(&mut election.vote_counts, &candidate_address);
    vec_map::insert(&mut election.vote_counts, candidate_address, current + 1);

    election.total_votes = election.total_votes + 1;

    event::emit(EventVoteCast {
        election_id: election_id_u64,
        voter: voter_address,
        candidate: candidate_address,
    });
}

// Helper: Get candidate info (if present)
public fun get_candidate_info(
    election: &Election,
    candidate_address: address,
): option::Option<Candidateinfo> {
    if (vec_map::contains(&election.candidate_info, &candidate_address)) {
        let info_ref = vec_map::get(&election.candidate_info, &candidate_address);
        option::some(*info_ref)
    } else {
        option::none()
    }
}

// Helper: Get vote count for a specific candidate
public fun get_vote_count(election: &Election, candidate_address: address): u64 {
    if (vec_map::contains(&election.vote_counts, &candidate_address)) {
        *vec_map::get(&election.vote_counts, &candidate_address)
    } else {
        0
    }
}

// ==================== ELECTION LIFECYCLE FUNCTIONS ====================

// Create a new election (Issue #2)
public entry fun create_election(
    name: String,
    description: String,
    start_time: u64,
    end_time: u64,
    ctx: &mut TxContext,
) {
    assert!(end_time > start_time, EInvalidTime);

    let election = Election {
        id: object::new(ctx),
        name,
        description,
        start_time,
        end_time,
        is_active: false,
        is_ended: false,
        candidate_addresses: vector::empty<address>(),
        candidate_info: vec_map::empty<address, Candidateinfo>(),
        vote_counts: vec_map::empty<address, u64>(),
        voters: vec_map::empty<address, bool>(),
        total_votes: 0,
        winner: option::none<address>(),
    };

    let election_id = object::id(&election);
    let election_addr = object::id_to_address(&election_id);
    let election_id_u64 = (address::to_u256(election_addr) as u64);

    let admin_cap = ElectionAdminCap {
        id: object::new(ctx),
        election_id,
    };

    event::emit(EventElectionCreated {
        election_id: election_id_u64,
        name: election.name,
        creator: tx_context::sender(ctx),
    });

    transfer::share_object(election);
    transfer::public_transfer(admin_cap, tx_context::sender(ctx));
}

// Start the election (Issue #2)
public entry fun start_election(
    admin_cap: &ElectionAdminCap,
    election: &mut Election,
    _ctx: &mut TxContext,
) {
    assert!(admin_cap.election_id == object::id(election), EAdminCapMismatch);
    assert!(!election.is_ended, EElectionEnded);

    election.is_active = true;
}

// Pause the election (Issue #2)
public entry fun pause_election(
    admin_cap: &ElectionAdminCap,
    election: &mut Election,
    _ctx: &mut TxContext,
) {
    assert!(admin_cap.election_id == object::id(election), EAdminCapMismatch);

    election.is_active = false;
}

// Update candidate info (Issue #3)
public entry fun update_candidate_info(
    admin_cap: &ElectionAdminCap,
    election: &mut Election,
    candidate_address: address,
    new_name: String,
    new_description: String,
    new_pfp: String,
    _ctx: &mut TxContext,
) {
    assert!(admin_cap.election_id == object::id(election), EAdminCapMismatch);
    assert!(vec_map::contains(&election.candidate_info, &candidate_address), ECandidateNotFound);

    vec_map::remove(&mut election.candidate_info, &candidate_address);
    let new_info = Candidateinfo {
        name: new_name,
        description: new_description,
        pfp: new_pfp,
    };
    vec_map::insert(&mut election.candidate_info, candidate_address, new_info);
}

// End the election and calculate winner (Issue #6)
public entry fun end_election(
    admin_cap: &ElectionAdminCap,
    election: &mut Election,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(admin_cap.election_id == object::id(election), EAdminCapMismatch);
    assert!(!election.is_ended, EElectionEnded);

    let current_time = clock::timestamp_ms(clock);
    assert!(current_time >= election.end_time, EElectionNotEnded);

    election.is_active = false;
    election.is_ended = true;

    // Calculate winner - find candidate with most votes
    let mut winner_addr: Option<address> = option::none();
    let mut max_votes: u64 = 0;

    let len = election.candidate_addresses.length();
    let mut i = 0;
    while (i < len) {
        let addr = *election.candidate_addresses.borrow(i);
        let votes = *vec_map::get(&election.vote_counts, &addr);
        if (votes > max_votes) {
            max_votes = votes;
            winner_addr = option::some(addr);
        };
        i = i + 1;
    };

    election.winner = winner_addr;

    let election_id_obj = object::id(election);
    let election_addr = object::id_to_address(&election_id_obj);
    let election_id_u64 = (address::to_u256(election_addr) as u64);

    // Create ElectionResult object
    let (winner_address, winner_desc, winner_pfp_str) = if (
        option::is_some(&winner_addr)
    ) {
        let w_addr = *option::borrow(&winner_addr);
        let info = vec_map::get(&election.candidate_info, &w_addr);
        let desc = info.description;
        let pfp = info.pfp;
        (copy w_addr, desc, pfp)
    } else {
        (@0x0, std::string::utf8(b""), std::string::utf8(b""))
    };

    let election_result = ElectionResult {
        id: object::new(ctx),
        election_id: election_id_u64,
        election_name: election.name,
        election_description: election.description,
        winner_address,
        winner_name: max_votes, // Using winner_votes count as per struct definition
        winner_description: winner_desc,
        winner_votes: max_votes,
        winner_pfp: winner_pfp_str,
        total_votes: election.total_votes,
        end_time: election.end_time,
        all_results: election.vote_counts,
    };

    transfer::share_object(election_result);

    event::emit(EventElectionEnded {
        election_id: election_id_u64,
        winner: winner_addr,
        total_votes: election.total_votes,
    });
}

// ==================== ADDITIONAL HELPER FUNCTIONS ====================

// Get election info (Issue #7)
public fun get_election_info(election: &Election): (String, String, u64, u64, bool, bool, u64) {
    (
        election.name,
        election.description,
        election.start_time,
        election.end_time,
        election.is_active,
        election.is_ended,
        election.total_votes,
    )
}
