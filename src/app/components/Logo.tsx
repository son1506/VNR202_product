const Logo = ({ collapsed, className }) => {
    return (
        <div className={`flex items-center gap-2 transition-all duration-300 ${className}`}>
            <img
                src="https://vawr.vn/images/logo-google.png"
                alt="Logo"
                className="h-8 w-8 object-contain"
            />
            {!collapsed && <span className="text-lg font-semibold">Logo web</span>}
        </div>
    );
};

export default Logo;