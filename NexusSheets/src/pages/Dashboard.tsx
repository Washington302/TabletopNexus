import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => (
	<div style={{
		maxWidth: 700,
		margin: '2rem auto',
		padding: '2rem',
		background: 'var(--color-bg-dark)',
		borderRadius: 16,
		boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
		color: 'var(--color-text-main)'
	}}>
		<h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16, color: 'var(--color-text-gold)' }}>Welcome to NexusSheets</h1>
		<p style={{ marginBottom: 24, color: 'var(--color-text-muted)' }}>Your tabletop RPG character and campaign manager.</p>
		<div style={{ display: 'flex', gap: '1.5rem', marginBottom: 16 }}>
			<Link to="/character/godbound" style={{ color: 'var(--color-text-link)', fontWeight: 600, textDecoration: 'none' }}>Godbound Sheet</Link>
			<Link to="/character/ars-magica" style={{ color: 'var(--color-text-link)', fontWeight: 600, textDecoration: 'none' }}>Ars Magica Sheet</Link>
		</div>
		<div style={{ marginTop: 32, color: 'var(--color-text-muted)', fontSize: '1rem' }}>
			<p>Use the navigation bar above to access your character sheets or return to this dashboard at any time.</p>
		</div>
	</div>
);

export default Dashboard;
